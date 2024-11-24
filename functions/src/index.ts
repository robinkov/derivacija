'use server'

// firebase admin sdk
import { initializeApp } from 'firebase-admin/app'
import * as functions from 'firebase-functions/v1'
import { getFirestore } from 'firebase-admin/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getAuth } from 'firebase-admin/auth'
import * as logger from 'firebase-functions/logger'

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

  // check is user with that email address already exists
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
  } catch (error) {
    logger.error('Error when trying to create a user with email and password.');
    throw new HttpsError('internal', 'Greška kod registriranja korisnika.');
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
    return query.set({ email, uid });
  } catch (error) {
    logger.error('Error adding new user to Firestore.', error);
    return;
  }

});
