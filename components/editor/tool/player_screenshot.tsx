import React, { useState } from 'react';
import { z } from 'zod';
import { CompositionProps, COMP_NAME } from "../../../types/constants";
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store/store';

interface ScreenShotProps {
  inputProps: z.infer<typeof CompositionProps>;
}

export default function ScreenShot({ inputProps }: ScreenShotProps) {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [loading, setLoading] = useState(false);
  const playercurrentframe = useSelector(
    (state: RootState) => state.slices.present.playertotalframe
  );

  async function fetchRenderedFrame() {
    setLoading(true);
    try {
      const res = await fetch('/api/renderStill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compositionId: COMP_NAME,
          frame: playercurrentframe,
          inputProps: inputProps || {},
          imageFormat: format,
        }),
      });

      const data = await res.json();

      if (data.imageUrl) {
        console.log('Image URL:', data.imageUrl);
        const link = document.createElement('a');
        link.href = data.imageUrl;
        link.download = `screenshot.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Error:', data.error);
        alert("Failed to generate screenshot");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="flex items-center justify-between gap-2 ">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>

        <button
          onClick={fetchRenderedFrame}
          className="kd-primary-btn flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              Processing...
            </>
          ) : (
            "Screenshot"
          )}
        </button>
      </div>
    </main>
  );
}
