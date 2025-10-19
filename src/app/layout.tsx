import '@/styles/globals.css';
import styles from './layout.module.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.appContainer}>
          <header className={styles.header}>
            <h1 className={styles.title}>🌐 Translator MVP</h1>
          </header>

          <main className={styles.main}>{children}</main>

          <footer className={styles.footer}>
            <p>Built with ❤️ by Marat Kuzakhmetov</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
