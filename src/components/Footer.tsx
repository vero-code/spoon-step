export function Footer() {
  return (
    <footer className="w-full py-4 border-t border-neutral-900/60 text-center text-xs text-neutral-400 px-4 font-mono">
      <span>
        © 2026 SpoonStep by {' '}
        <a
          style={{ color: '#cbd5e1' }}
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/vero-code/spoon-step"
        >
          Veronika Kashtanova
        </a>{' '} for {' '}
        <a
          style={{ color: '#cbd5e1' }}
          target="_blank"
          rel="noopener noreferrer"
          href="https://hack-for-humanity-summer-26.devpost.com/"
        >
          Hack for Humanity | Summer 2026 hackathon
        </a>
      </span>
    </footer>
  );
}
