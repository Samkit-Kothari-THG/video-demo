import {ImageResponse} from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#75364a',
          color: '#fffaf4',
          display: 'flex',
          fontFamily: 'Georgia, serif',
          fontSize: 310,
          height: '100%',
          justifyContent: 'center',
          letterSpacing: '-0.08em',
          paddingBottom: 28,
          width: '100%',
        }}
      >
        V
      </div>
    ),
    size,
  );
}
