'use server'

// firebase admin sdk
import { initializeApp } from 'firebase-admin/app'
import * as functions from 'firebase-functions/v1'
import { DocumentReference, FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getAuth } from 'firebase-admin/auth'
import * as logger from 'firebase-functions/logger'
import { sendResetEmail, sendVerificationEmail } from './helpers/senders'
import { emailCodeGenerator, oobCodeGenerator } from './helpers/generators'
import { UserInfo } from 'firebase-functions/v1/auth'

initializeApp({
  serviceAccountId: 'firebase-adminsdk-53qn9@derivacija-74cc6.iam.gserviceaccount.com',
});

export const registerUser = onCall(async (request) => {
  if (request.auth) {
    throw new HttpsError('permission-denied', 'Korisnik je već prijavljen.');
  }
  const email: string = request.data.email.trim();
  const password: string = request.data.password.trim();
  const confirmPassword: string = request.data.confirmPassword.trim();
  const customClaims = { role: 'user' };

  if (!email || !password || !confirmPassword) {
    const _arguments = Object.entries(request.data)
      .filter((entry) => !entry[1]).map((entry) => entry[0]);
    logger.error('Missing or incomplete arguments: ' + _arguments.join(', '));
    throw new HttpsError('invalid-argument', 'Sva polja moraju biti ispunjena.', ['email', 'password', 'confirm-password']);
  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email)) {
    throw new HttpsError('invalid-argument', 'Neispravna email adresa.', ['email']);
  }

  if (password !== confirmPassword) {
    throw new HttpsError('invalid-argument', 'Lozinka i potvrda lozinke se ne podudaraju.', ['password', 'confirm-password']);
  }

  if (password.length < 6) {
    throw new HttpsError('invalid-argument', 'Minimalna duljina lozinke je 6 znakova.', ['password']);
  }

   // check if user with that email address already exists
  try {
    const query = getFirestore().collection('users').where('email', '==', email);
    const snapshot = await query.get();
    if (!snapshot.empty) {
      throw new HttpsError('permission-denied', 'Korisnik s tom email adresom već postoji.', ['email']);
    }
  } catch (error) {
    if (error instanceof HttpsError) {
      throw new HttpsError(error.code, error.message, error.details);
    }
    logger.error('Internal server error while checking if email address already exists.');
    throw new HttpsError('internal', 'Greška kod provjere email adrese.');
  }

  try {
    const userRecord = await getAuth().createUser({ email, password, emailVerified: false });
    await getAuth().setCustomUserClaims(userRecord.uid, customClaims);
    return getAuth().createCustomToken(userRecord.uid, customClaims);
  } catch (error: any) {
    logger.error('Error when trying to create a user with email and password.');
    throw new HttpsError('internal', error.message);
  }

});

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email;
  // get updated custom claims value
  const customClaims = (await getAuth().getUser(uid)).customClaims;

  if (!uid || !email) {
    logger.error('\'uid\' and/or \'email\' were not present on \'user\' object.');
    return;
  }

  // if there is no custom claims object or if there is no role property on that object
  if (!customClaims || !customClaims['role']) {
    try {
      await getAuth().setCustomUserClaims(uid, { ...customClaims, role: 'user' });
      logger.log('Added \'user\' role for user with uid ' + uid);
    } catch (error) {
      logger.error('Error setting user role.', error);
      return;
    }
  }

  try {
    const query = getFirestore().collection('users').doc(uid);
    let code;
    let userObj: any = { email, uid };
    if (!user.emailVerified) {
      code = emailCodeGenerator();
      const verificationRef = await sendVerificationEmail(email, code);
      userObj = { ...userObj, otpCode: code, otpEmailRef: verificationRef };
    }
    return query.set(userObj);
  } catch (error) {
    logger.error('Error adding new user to Firestore.', error);
    return;
  }

});

export const verifyOTPCode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('permission-denied', 'Korisnik nije ulogiran.');
  }

  const otpCode: string = request.data.otpCode.trim();

  if (otpCode.length !== 6) {
    throw new HttpsError('invalid-argument', 'Kod nije unesen.');
  }

  const response = await getFirestore().collection('users').where('otpCode', '==', otpCode).get();

  // if response is empty or OTP code does not belong to this user
  if (response.empty || response.docs.filter((doc) => doc.data().email === request.auth?.token.email).length === 0) {
    throw new HttpsError('invalid-argument', 'Uneseni kod je netočan.');
  }

  const uid = request.auth.uid;

  return getAuth().updateUser(uid, { emailVerified: true });
});

export const resendOTPCode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('permission-denied', 'Korisnik nije ulogiran.');
  }

  if (request.auth.token.email_verified) {
    throw new HttpsError('cancelled', 'Korisnik je već potvrdio email adresu.');
  }
  
  const uid = request.auth.uid;
  const email = request.auth.token.email;
  const userDocSnapshot = await getFirestore().collection('users').doc(uid).get();
  const userDocData = userDocSnapshot.data();
  const code = emailCodeGenerator();
  
  if (userDocData?.otpEmailRef) {
    const otpEmailRef = userDocData.otpEmailRef as DocumentReference;
    const emailDocData = (await otpEmailRef.get()).data();

    if (!emailDocData?.delivery?.endTime) throw new HttpsError('internal', 'Malo strpljenja, email se još šalje.');
    
    const timestamp = emailDocData.delivery.endTime as Timestamp;
    const resendAfter = 60 * 1000 // one minute
    
    if ((timestamp.toMillis() + resendAfter) >= Date.now()) {
      throw new HttpsError('resource-exhausted', 'Pričekaj 1 minutu prije slanja idućeg koda.');
    }
  }

  try {
    if (!email) throw new Error('Token ne sadrži email adresu.');
    const verificationRef = await sendVerificationEmail(email, code);
    return getFirestore().collection('users').doc(uid).update({
      otpCode: code,
      otpEmailRef: verificationRef,
    });
  } catch (error) {
    throw new HttpsError('internal', 'Dogodila se greška.');
  }

});

export const sendPasswordResetEmail = onCall(async (request) => {
  const email = request.data.email;
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email || !emailRegex.test(email)) {
    throw new HttpsError('invalid-argument', 'Email nije unešen ili je neispravan.')
  }
  const oobCode = oobCodeGenerator();
  const userQuery = getFirestore().collection('users').where('email', '==', email);
  let querySnapshot;
  try {
    const response = await userQuery.get();
    if (response.empty) {
      throw new HttpsError('unavailable', 'Korisnik s tom email adresom ne postoji.');
    }
    querySnapshot = response.docs[0];
    let userProviders = (await getAuth().getUser(querySnapshot.id)).providerData as UserInfo[];
    userProviders = userProviders.filter((e) => e.providerId === 'password');
    if (userProviders.length === 0) {
      throw new HttpsError('aborted', 'Korisnik je registriran preko vanjskog pružatelja.');
    }
    await getFirestore().collection('users').doc(querySnapshot.id).update({ oobCode });
    await sendResetEmail(email, oobCode);
    return;
  } catch (error) {
    if (error instanceof HttpsError) {
      throw new HttpsError(error.code, error.message);
    }
    throw new HttpsError('internal', 'Dogodila se greška prilikom slanja.');
  }
});

export const changePassword = onCall(async (request) => {
  const email = request.data.email;
  const oobCode = request.data.oobCode;
  const password = request.data.password.trim();
  const confirmPassword = request.data.confirmPassword.trim();

  if (!email || !oobCode || !password || !confirmPassword) {
    throw new HttpsError('invalid-argument', 'Neuspješna promjena lozinke!');
  }

  if (password !== confirmPassword) {
    throw new HttpsError('invalid-argument', 'Lozinka i potvrda lozinke se ne podudaraju.');
  }

  try {
    const userQuery = getFirestore().collection('users').where('email', '==', email);
    const userSnapshot = await userQuery.get();
    
    if (userSnapshot.empty) {
      throw new HttpsError('invalid-argument', 'Ne postoji korisnik s ovom email adresom.');
    }
    const userData = userSnapshot.docs[0].data();
    const userCode = userData['oobCode'];
    
    if (userCode !== oobCode) {
      throw new HttpsError('aborted', 'Nije dozvoljena promjena lozinke.');
    }

    try {
      await getAuth().updateUser(userData['uid'], { password });
    } catch(error) {
      throw new HttpsError('invalid-argument', 'Lozinka mora sadržavati minimalno 6 znakova.');
    }

    await getFirestore().collection('users').doc(userData['uid']).update({
      oobCode: FieldValue.delete()
    });
    
    return;
  } catch(error) {
    if (error instanceof HttpsError) {
      throw new HttpsError(error.code, error.message);
    } else {
      throw new HttpsError('internal', 'Dogodila se neočekivana greška.');
    }
  }
});
