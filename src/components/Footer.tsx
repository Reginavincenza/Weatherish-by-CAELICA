const Footer = () => {
  return (
    <footer className="relative z-10 bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-6 text-center">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">CAELICA</span> © 2025, designed by{" "}
          <a
            href="https://lovable.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-glow transition-colors font-medium"
          >
            Lovable
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
