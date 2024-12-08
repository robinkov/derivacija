type PasswordResetProperties = {
  email: string,
  oobCode: string
}

export default function passwordResetTemplate(properties: PasswordResetProperties) {
  const { email, oobCode } = properties;
  const link = `https://derivacija.com/auth/password-reset/change?email=${email}&code=${oobCode}`;
  return (
`
<p>Pozdrav,</p>
<p>Slijedi ovaj link kako biste resetirali vašu Derivacija lozinku za ${email} račun.</p>
<p><a href='${link}'>${link}</a></p>
<p>Ako niste zatražili promjenu lozinke, onda ignorirajte ovu poruku.</p>
<p>Hvala,</p>
<p>Vaš Derivacija tim.</p>
`
);}
