import { getFirestore } from "firebase-admin/firestore";
import emailVerificationTemplate from "../templates/email-verification";

export async function sendVerificationEmail(to: string, code: string) {
  return getFirestore().collection('mail').add({
    to,
    message: {
      subject: 'Potvrda email adrese.',
      html: emailVerificationTemplate({ code }),
    },
  });
}
