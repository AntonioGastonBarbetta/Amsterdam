import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";
import { AuthorizationError } from "./api";

const TEST_EMAIL = process.env.TEST_EMAIL;

const clientIds = [
  process.env.GOOGLE_CLIENT_ID,
  process.env.TEST_CLIENT_ID,
].filter((clientId) => clientId);

const googleOauthClients = clientIds.map(
  (clientId) => new OAuth2Client(clientId),
);

export type ProfileType = {
  email: string;
};

export async function verify(token: string): Promise<ProfileType> {
  console.log(`Auth request: ${token}`);
  if (token == TEST_EMAIL) return { email: TEST_EMAIL };
  for (const i in googleOauthClients) {
    const client = googleOauthClients[i];
    const clientId = clientIds[i];
    try {
      const ticket: LoginTicket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      const profile: TokenPayload | undefined = ticket.getPayload();
      console.log(`Auth response: ${JSON.stringify(profile)}`);
      if (profile?.email) return { email: profile.email };
    } catch (error) {
      console.error(`Auth error: ${JSON.stringify(error)}`);
    }
  }
  throw new AuthorizationError("Unauthorized");
}
