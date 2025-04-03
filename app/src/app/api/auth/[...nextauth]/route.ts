import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Calcula a URL de implantação correta
const deploymentUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Configure as opções de autenticação
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  debug: process.env.NODE_ENV !== 'production',
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 Sign In callback', { user: user.email, provider: account?.provider });
      return true;
    },
    async session({ session, token }) {
      console.log('🔄 Session callback', { user: session.user?.email });
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔀 Redirect callback', { url, baseUrl });
      
      // Redirecionamentos relativos - adiciona o baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Mesmo domínio - permite o redirecionamento
      else if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Redirecionamento padrão para a raiz
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

console.log('🚀 API de autenticação inicializada', { 
  clientId: process.env.GOOGLE_CLIENT_ID ? 'Definido' : 'Não definido',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Definido' : 'Não definido',
  secret: process.env.NEXTAUTH_SECRET ? 'Definido' : 'Não definido',
  nextauthUrl: process.env.NEXTAUTH_URL || 'Não definido'
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 