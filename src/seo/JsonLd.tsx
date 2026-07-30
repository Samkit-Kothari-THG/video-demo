type JsonLdProps = {
  data: Record<string, unknown> | readonly unknown[];
};

export const JsonLd = ({data}: JsonLdProps) => (
  <script
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
    type="application/ld+json"
  />
);
