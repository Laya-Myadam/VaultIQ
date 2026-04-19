import Topbar from '../layout/Topbar';

export default function PageLayout({ title, subtitle, children }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
      background: 'var(--bg)',
    }}>
      <Topbar title={title} subtitle={subtitle} />
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '22px 26px 32px',
      }}>
        {children}
      </main>
    </div>
  );
}
