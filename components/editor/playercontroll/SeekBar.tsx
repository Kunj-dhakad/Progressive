import type { PlayerRef } from "@remotion/player";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaGripLinesVertical } from "react-icons/fa";
import { interpolate } from "remotion";

type Size = {
  width: number;
  height: number;
  left: number;
  top: number;
};

// If a pane has been moved, it will cause a layout shift without
// the window having been resized. Those UI elements can call this API to
// force an update

export const useElementSize = (
  ref: React.RefObject<HTMLElement>
): Size | null => {
  const [size, setSize] = useState<Size | null>(() => {
    if (!ref.current) {
      return null;
    }

    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      return null;
    }

    return {
      width: rect[0].width as number,
      height: rect[0].height as number,
      left: rect[0].x as number,
      top: rect[0].y as number,
    };
  });

  const observer = useMemo(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }

    return new ResizeObserver((entries) => {
      const { target } = entries[0];
      const newSize = target.getClientRects();

      if (!newSize?.[0]) {
        setSize(null);
        return;
      }

      const { width } = newSize[0];

      const { height } = newSize[0];

      setSize({
        width,
        height,
        left: newSize[0].x,
        top: newSize[0].y,
      });
    });
  }, []);

  const updateSize = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      setSize(null);
      return;
    }

    setSize((prevState) => {
      const isSame =
        prevState &&
        prevState.width === rect[0].width &&
        prevState.height === rect[0].height &&
        prevState.left === rect[0].x &&
        prevState.top === rect[0].y;
      if (isSame) {
        return prevState;
      }

      return {
        width: rect[0].width as number,
        height: rect[0].height as number,
        left: rect[0].x as number,
        top: rect[0].y as number,
        windowSize: {
          height: window.innerHeight,
          width: window.innerWidth,
        },
      };
    });
  }, [ref]);

  useEffect(() => {
    if (!observer) {
      return;
    }

    const { current } = ref;
    if (current) {
      observer.observe(current);
    }

    return (): void => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [observer, ref, updateSize]);

  useEffect(() => {
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [updateSize]);

  return useMemo(() => {
    if (!size) {
      return null;
    }

    return { ...size, refresh: updateSize };
  }, [size, updateSize]);
};

const getFrameFromX = (
  clientX: number,
  durationInFrames: number,
  width: number
) => {
  const pos = clientX;
  const frame = Math.round(
    interpolate(pos, [0, width], [0, Math.max(durationInFrames - 1, 0)], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  return frame;
};


const VERTICAL_PADDING = 8;

const containerStyle: React.CSSProperties = {
  userSelect: "none",
  WebkitUserSelect: "none",
  paddingTop: VERTICAL_PADDING,
  paddingBottom: VERTICAL_PADDING,
  boxSizing: "border-box",
  cursor: "pointer",
  position: "relative",
  touchAction: "none",
  flex: 1,
};



const findBodyInWhichDivIsLocated = (div: HTMLElement) => {
  let current = div;

  while (current.parentElement) {
    current = current.parentElement;
  }

  return current;
};

export const useHoverState = (ref: React.RefObject<HTMLDivElement>) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const { current } = ref;
    if (!current) {
      return;
    }

    const onHover = () => {
      setHovered(true);
    };

    const onLeave = () => {
      setHovered(false);
    };

    const onMove = () => {
      setHovered(true);
    };

    current.addEventListener("mouseenter", onHover);
    current.addEventListener("mouseleave", onLeave);
    current.addEventListener("mousemove", onMove);

    return () => {
      current.removeEventListener("mouseenter", onHover);
      current.removeEventListener("mouseleave", onLeave);
      current.removeEventListener("mousemove", onMove);
    };
  }, [ref]);
  return hovered;
};

export const SeekBar: React.FC<{
  durationInFrames: number;
  inFrame?: number | null;
  outFrame?: number | null;
  playerRef: React.RefObject<PlayerRef>;
}> = ({ durationInFrames, inFrame, outFrame, playerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const barHovered = useHoverState(containerRef);
  const size = useElementSize(containerRef);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const { current } = playerRef;
    if (!current) {
      return;
    }

    const onFrameUpdate = () => {
      setFrame(current.getCurrentFrame());
    };

    current.addEventListener("frameupdate", onFrameUpdate);

    return () => {
      current.removeEventListener("frameupdate", onFrameUpdate);
    };
  }, [playerRef]);

  useEffect(() => {
    const { current } = playerRef;
    if (!current) {
      return;
    }

    const onPlay = () => {
      setPlaying(true);
    };

    const onPause = () => {
      setPlaying(false);
    };

    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);

    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, [playerRef]);

  const [dragging, setDragging] = useState<
    | {
      dragging: false;
    }
    | {
      dragging: true;
      wasPlaying: boolean;
    }
  >({
    dragging: false,
  });

  const width = size?.width ?? 0;

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) {
        return;
      }

      if (!playerRef.current) {
        return;
      }

      const posLeft = containerRef.current?.getBoundingClientRect()
        .left as number;

      const _frame = getFrameFromX(
        e.clientX - posLeft,
        durationInFrames,
        width
      );
      playerRef.current.pause();
      playerRef.current.seekTo(_frame);
      setDragging({
        dragging: true,
        wasPlaying: playing,
      });
    },
    [durationInFrames, width, playerRef, playing]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!size) {
        throw new Error("Player has no size");
      }

      if (!dragging.dragging) {
        return;
      }

      if (!playerRef.current) {
        return;
      }

      const posLeft = containerRef.current?.getBoundingClientRect()
        .left as number;

      const _frame = getFrameFromX(
        e.clientX - posLeft,
        durationInFrames,
        size.width
      );
      playerRef.current.seekTo(_frame);
    },
    [dragging.dragging, durationInFrames, playerRef, size]
  );

  const onPointerUp = useCallback(() => {
    setDragging({
      dragging: false,
    });
    if (!dragging.dragging) {
      return;
    }

    if (!playerRef.current) {
      return;
    }

    if (dragging.wasPlaying) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [dragging, playerRef]);

  useEffect(() => {
    if (!dragging.dragging) {
      return;
    }

    const body = findBodyInWhichDivIsLocated(
      containerRef.current as HTMLElement
    );

    body.addEventListener("pointermove", onPointerMove);
    body.addEventListener("pointerup", onPointerUp);
    return () => {
      body.removeEventListener("pointermove", onPointerMove);
      body.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging.dragging, onPointerMove, onPointerUp]);


  const fillStyle: React.CSSProperties = useMemo(() => {
    return {

      left: ((frame - (inFrame ?? 0)) / (durationInFrames - 1)) * 100 + "%",
      top: "50%",
      transform: "translateY(-50%)",
    };
  }, [durationInFrames, frame, inFrame]);

  const leftPosition: React.CSSProperties = useMemo(() => {
    // console.log("leftPosition", frame, inFrame);
    return {
      left: 5,
      top:"15px",
      zIndex: 10,
      width: "2px",
      height: "430px",
      marginLeft:
        ((frame - (inFrame ?? 0)) / (durationInFrames - 1)) * 100 + "%",
    };
  }, [durationInFrames, frame, inFrame]);

  return (
    <div>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        style={containerStyle}
      >
        <div>
          <div
            className="absolute h-5 w-3  kd-custom-bg-color rounded cursor-ew-resize flex items-center justify-center"
            style={fillStyle}>
            < FaGripLinesVertical className="z-20 text-xs " />
          </div>


          <div
            className="absolute cursor-ew-resize kd-custom-bg-color "
            style={leftPosition}
          ></div>
        </div>
      </div>
    </div>
  );
};
