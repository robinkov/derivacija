import { getFirestore } from "firebase-admin/firestore";
import emailVerificationTemplate from "../templates/email-verification";
import passwordResetTemplate from "../templates/password-reset";

export async function sendVerificationEmail(to: string, code: string) {
  return getFirestore().collection('mail').add({
    to,
    message: {
      subject: 'Potvrda email adrese.',
      html: emailVerificationTemplate({ code }),
    },
  });
}

export async function sendResetEmail(to: string, oobCode: string) {
  return getFirestore().collection('mail').add({
    to,
    message: {
      subject: 'Promjena lozinke.',
      html: passwordResetTemplate({ email: to, oobCode }),
    }
  });
}
