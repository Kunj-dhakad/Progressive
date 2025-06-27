import React, {
  useState, useEffect,
  //  useRef 
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { updateClip } from "../../../app/store/clipsSlice";
import {
  //  LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp, 
  LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import { TbBackground } from "react-icons/tb";
import { PiSelectionBackground } from "react-icons/pi";
import AnimationHelper from "../helper/animation_helper";
const ImageEditTool: React.FC = () => {
  const Activeid = useSelector(
    (state: RootState) => state.editorTool.Activeid
  );
  const dispatch = useDispatch();

  // if (Activeid === '') {
  //   dispatch(setActiveid(''));
  //   return null; 
  // }

  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );
  // const Activeid = useSelector(
  //   (state: RootState) => state.slices.present.Activeid
  // );


  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(360);
  const [opacity, setOpacity] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [animationType, setanimationType] = useState('');

  const [transform, settransform] = useState("");
  const [borderRadius, setborderRadius] = useState("");
  // Filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(1);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [saturate, setSaturate] = useState(1);
  const [hueRotate, setHueRotate] = useState(0);

  // type AnimationType = "None" | "Fade" | "Zoom" | "Slide";
  // interface AnimationState {
  //   type: AnimationType;
  //   duration: number;
  //   slideDistanceX?: number;
  //   slideDistanceY?: number;
  // }

  // const [animationIn, setAnimationIn] = useState<AnimationState>({
  //   type: "None",
  //   duration: 1,
  //   slideDistanceX: 0,
  //   slideDistanceY: 0,
  // });

  // const [animationOut, setAnimationOut] = useState<AnimationState>({
  //   type: "None",
  //   duration: 1,
  //   slideDistanceX: 0,
  //   slideDistanceY: 0,
  // });



  useEffect(() => {
    const activeImage = Allclips.find((image) => image.id === Activeid);

    if (activeImage?.type === "image") {
      setanimationType(activeImage.properties.animationType)
      setWidth(activeImage.properties.width);
      setHeight(activeImage.properties.height);
      setOpacity(activeImage.properties.opacity || 1);
      setRotation(activeImage.properties.rotation || 0);
      setPositionX(activeImage.properties.left);
      setPositionY(activeImage.properties.top);
      setBrightness(activeImage.properties.brightness || 1);
      setContrast(activeImage.properties.contrast || 1);
      setGrayscale(activeImage.properties.grayscale || 0);
      setSepia(activeImage.properties.sepia || 0);
      setBlur(activeImage.properties.blur || 0);
      setSaturate(activeImage.properties.saturate || 1);
      setHueRotate(activeImage.properties.hueRotate || 0);
      setborderRadius(activeImage.properties.borderRadius);
      settransform(activeImage.properties.transform);


      // const { animation } = activeImage.properties;
      // setAnimationIn({
      //   type: animation?.in?.type ?? "None",
      //   duration: animation?.in?.duration ?? 1000,
      //   slideDistanceX: animation?.in?.slideDistanceX ?? 0,
      //   slideDistanceY: animation?.in?.slideDistanceY ?? 0,
      // });
      // setAnimationOut({
      //   type: animation?.out?.type ?? "None",
      //   duration: animation?.out?.duration ?? 1000,
      //   slideDistanceX: animation?.out?.slideDistanceX ?? 0,
      //   slideDistanceY: animation?.out?.slideDistanceY ?? 0,
      // });
    }


  }, [Activeid, Allclips]);


  // update value function

  const update_value = (updateproperties: Partial<any>) => {
    dispatch(
      updateClip({
        id: Activeid,
        properties: {
          // animation: {
          //   // in: animationIn,
          //   // out: animationOut,
          // },
          animationType,
          width,
          height,
          rotation,
          opacity,
          borderRadius,
          transform,
          brightness,
          grayscale,
          blur,
          contrast,
          hueRotate,
          sepia,
          saturate,
          left: positionX,
          top: positionY,
          ...updateproperties
        },
      })
    );

  }


  const toggleFlip = (axis: string) => {
    settransform((prev) => {
      const newTransform = prev === `scale${axis}(-1)` ? "scale(1,1)" : `scale${axis}(-1)`;

      // ✅ setTimeout ensures update_value runs after state update
      setTimeout(() => {
        update_value({ transform: newTransform });
      }, 0);

      return newTransform;
    });
  };
  const [activeTab, setActiveTab] = useState<"Image" | "animation">("Image");

  // const [InOutactiveTab, InOutsetActiveTab] = useState<"in" | "out">("in");


  // attached to the image bg 
  const bg_height = useSelector(
    (state: RootState) => state.slices.present.videoheight
  );
  const bg_width = useSelector(
    (state: RootState) => state.slices.present.videowidth
  );


  const BgAttech = () => {
    setWidth(bg_width)
    setHeight(bg_height)
    setPositionX(0)
    setPositionY(0)

    update_value({
      width: bg_width,
      height: bg_height,
      zindex: 99,
      left: 0,
      top: 0,
    });
  }

  const BgDAttech = () => {
    setWidth(bg_width / 2)
    setHeight(bg_height / 2)
    setPositionX(bg_width / 2 - bg_width / 4)
    setPositionY(bg_height / 2 - bg_height / 4)

    update_value({
      width: bg_width / 2,
      height: bg_height / 2,
      left: bg_width / 2 - bg_width / 4,
      top: bg_height / 2 - bg_height / 4,
      zindex: 1,
    });
  }

  return (

    <div className="kd-editor-panel">
      <div className="kd-tab-list style-2">
        <button
          onClick={() => setActiveTab("Image")}
          className={`kd-tab-btn ${activeTab === "Image" ? "active" : ""}`}
        >
          Image
        </button>
        <button
          onClick={() => setActiveTab("animation")}
          className={`kd-tab-btn ${activeTab === "animation" ? "active" : ""}`}
        >
          Animation
        </button>
      </div>

      {/* Control Panel */}
      {activeTab === "Image" && (

        <div>

          <div className="grid grid-cols-2 gap-4">
            {/* Width & Height */}
            <div>
              <label className="theme-small-text mb-2">Width</label>
              <input
                type="number"
                value={width}
                // onChange={(e) => setWidth(Number(e.target.value))}
                onChange={(e) => {
                  setWidth(Number(e.target.value))
                  update_value({ width: Number(e.target.value) })
                }}
                className="kd-form-input"
              />
            </div>
            <div>
              <label className="theme-small-text mb-2">Height</label>
              <input
                type="number"
                value={Math.round(height)}
                // onChange={(e) => setHeight(Number(e.target.value))}
                onChange={(e) => {
                  setHeight(Number(e.target.value))
                  update_value({ height: Number(e.target.value) })
                }}
                className="kd-form-input"
              />
            </div>

            {/* Opacity */}
            <div>
              <label className="theme-small-text mb-2">Opacity</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                // onChange={(e) => setOpacity(Number(e.target.value))}
                onChange={(e) => {
                  setOpacity(Number(e.target.value));
                  update_value({ opacity: Number(e.target.value) });
                }}
                className="w-full kd-range-input"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="theme-small-text mb-2">Rotation (°)</label>
              <input
                type="range"
                min="0"
                max="180"
                step="1"
                value={rotation}
                // onChange={(e) => setRotation(Number(e.target.value))}
                onChange={(e) => {
                  setRotation(Number(e.target.value));
                  update_value({ rotation: Number(e.target.value) });
                }}
                className="w-full kd-range-input"
              />
            </div>



            {/* transform */}
            <div>
              <label className="theme-small-text mb-2">Flip</label>
              <div className="flex gap-2">
                <div className="btn-bx" onClick={() => toggleFlip("X")}>
                  <LuFlipHorizontal2 className="text-white" />
                </div>
                <div className="btn-bx" onClick={() => toggleFlip("Y")}>
                  <LuFlipVertical2 className="text-white" />
                </div>
              </div>
            </div>



            {/* bg attech disatech */}
            <div>
              <label className="theme-small-text mb-2">BG Attach/Detach</label>
              <div className="flex gap-2">
                <div className="btn-bx" onClick={() => BgAttech()}>
                  <TbBackground className="text-white" />
                </div>
                <div className="btn-bx" onClick={() => BgDAttech()}>
                  <PiSelectionBackground className="text-white" />
                </div>
              </div>
            </div>








            {/* borderRadius */}
            <div>
              <label className="theme-small-text mb-2">Border Radius</label>
              <div className="kd-custom-bx rounded">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={borderRadius}
                  // onChange={(e) => setborderRadius(e.target.value)}
                  onChange={(e) => {
                    setborderRadius(e.target.value);
                    update_value({ borderRadius: e.target.value });
                  }}
                  className="w-full kd-range-input"
                />
                <span className="block mt-1 text-sm text-white">Radius: {borderRadius}px</span>
              </div>
            </div>


            {/* Position */}
            <div>
              <label className="theme-small-text mb-2">Position X (px)</label>
              <input
                type="number"
                value={positionX}
                // onChange={(e) => setPositionX(Number(e.target.value))}

                onChange={(e) => {
                  setPositionX(Number(e.target.value));
                  update_value({ positionX: Number(e.target.value) });
                }}
                className="kd-form-input"
              />
            </div>
            <div>
              <label className="theme-small-text mb-2">Position Y (px)</label>
              <input
                type="number"
                value={positionY}
                // onChange={(e) => setPositionY(Number(e.target.value))}
                onChange={(e) => {
                  setPositionY(Number(e.target.value));
                  update_value({ positionY: Number(e.target.value) });
                }}
                className="kd-form-input"
              />
            </div>

            {/* Filters */}
          </div>
          <div className="w-full">
            <h2 className="my-3 text-2xl text-white "> Image effect</h2>
            <div className="w-full flex items-center mb-4">
              <label className="theme-small-text mb-2 w-8/12">Brightness</label>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={brightness}
                onChange={(e) => {
                  setBrightness(Number(e.target.value));
                  update_value({ brightness: Number(e.target.value) });
                }}
                // onChange={(e) => setBrightness(Number(e.target.value))}
                className="kd-range-input"
              />
            </div>
            <div className="w-full flex items-center mb-4">
              <label className="theme-small-text mb-2 w-8/12">Contrast</label>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={contrast}
                // onChange={(e) => setContrast(Number(e.target.value))}
                onChange={(e) => {
                  setContrast(Number(e.target.value));
                  update_value({ contrast: Number(e.target.value) });
                }}
                className=" kd-range-input"
              />
            </div>
            <div className="w-full flex items-center mb-4">
              <label className="theme-small-text mb-2 w-8/12">Grayscale</label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={grayscale}
                // onChange={(e) => setGrayscale(Number(e.target.value))}
                onChange={(e) => {
                  setGrayscale(Number(e.target.value));
                  update_value({ grayscale: Number(e.target.value) });
                }}
                className="kd-range-input"
              />
            </div>
            <div className="w-full flex items-center mb-4">
              <label className="theme-small-text mb-2 w-8/12">Sepia</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={sepia}
                // onChange={(e) => setSepia(Number(e.target.value))}
                onChange={(e) => {
                  setSepia(Number(e.target.value));
                  update_value({ sepia: Number(e.target.value) });
                }}
                className="kd-range-input"
              />
            </div>
            <div className="w-full flex items-center mb-4">
              <label className="theme-small-text mb-2 w-8/12">Blur (px)</label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={blur}
                // onChange={(e) => setBlur(Number(e.target.value))}
                onChange={(e) => {
                  setBlur(Number(e.target.value));
                  update_value({ blur: Number(e.target.value) });
                }}
                className="kd-range-input"
              />
            </div>
            <div className="w-full flex items-center mb-4">
              <label className="theme-small-text mb-2 w-8/12">Saturate</label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={saturate}
                // onChange={(e) => setSaturate(Number(e.target.value))}
                onChange={(e) => {
                  setSaturate(Number(e.target.value));
                  update_value({ saturate: Number(e.target.value) });
                }}
                className="kd-range-input"
              />
            </div>
            <div className="w-full flex items-center mb-4">
              <label className="theme-small-text mb-2 w-8/12">
                Hue Rotate(°)
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={hueRotate}
                // onChange={(e) => setHueRotate(Number(e.target.value))}
                onChange={(e) => {
                  setHueRotate(Number(e.target.value));
                  update_value({ hueRotate: Number(e.target.value) });
                }}
                className="kd-range-input"
              />
            </div>
          </div>
        </div>

      )}





      {/* Animated image Options */}
      {activeTab === "animation" && (
        <AnimationHelper />

        // <>
        //   <div className="kd-tab-list style-2">
        //     <button
        //       onClick={() => InOutsetActiveTab("in")}
        //       className={`kd-tab-btn ${InOutactiveTab === "in" ? "active" : ""}`}
        //     >
        //       In
        //     </button>
        //     <button
        //       onClick={() => InOutsetActiveTab("out")}
        //       className={`kd-tab-btn ${InOutactiveTab === "out" ? "active" : ""}`}
        //     >
        //       Out
        //     </button>
        //   </div>



        //   {InOutactiveTab === "in" && (


        //     // <>
        //     //   {/* 👇 Input sliders for Animation In */}
        //     //   {/* <div className="mb-4 space-y-2">
        //     //     <div>
        //     //       <label className="theme-small-text  w-8/12">In Duration (ms)</label>
        //     //       <input
        //     //         className="kd-range-input"
        //     //         type="range"
        //     //         min={100}
        //     //         max={5000}
        //     //         step={100}
        //     //         value={animationIn.duration}
        //     //         onChange={(e) => {
        //     //           const val = parseInt(e.target.value);
        //     //           const newAnim = { ...animationIn, duration: val };
        //     //           setAnimationIn(newAnim);
        //     //           update_value({ animation: { in: newAnim, out: animationOut } });
        //     //         }}
        //     //       />
        //     //       <div className="theme-small-text">{animationIn.duration} ms</div>
        //     //     </div>

        //     //     <div>
        //     //       <label className="theme-small-text mt-2 w-8/12">Slide Distance X slide left</label>
        //     //       <input
        //     //         className="kd-range-input"
        //     //         type="range"
        //     //         min={0}
        //     //         max={400}
        //     //         step={10}
        //     //         value={Math.abs(animationIn.slideDistanceX ?? 0)}
        //     //         onChange={(e) => {
        //     //           const val = -parseInt(e.target.value);
        //     //           const newAnim = { ...animationIn, slideDistanceX: val };
        //     //           setAnimationIn(newAnim);
        //     //           update_value({ animation: { in: newAnim, out: animationOut } });
        //     //         }}
        //     //       />
        //     //       <div className="theme-small-text">{animationIn.slideDistanceX}px</div>
        //     //     </div>

        //     //     <div>
        //     //       <label className="theme-small-text mt-2 w-8/12">Slide Distance X slide right</label>
        //     //       <input
        //     //         className="kd-range-input"
        //     //         type="range"
        //     //         min={0}
        //     //         max={400}
        //     //         step={10}
        //     //         value={animationIn.slideDistanceX}
        //     //         onChange={(e) => {
        //     //           const val = parseInt(e.target.value);
        //     //           const newAnim = { ...animationIn, slideDistanceX: val };
        //     //           setAnimationIn(newAnim);
        //     //           update_value({ animation: { in: newAnim, out: animationOut } });
        //     //         }}
        //     //       />
        //     //       <div className="theme-small-text">{animationIn.slideDistanceX}px</div>
        //     //     </div>
        //     //     <div>
        //     //       <label className="theme-small-text mt-2 w-8/12">Slide Distance Y slide top</label>
        //     //       <input
        //     //         className="kd-range-input"
        //     //         type="range"
        //     //         min={0}
        //     //         max={400}
        //     //         step={10}
        //     //         value={Math.abs(animationIn.slideDistanceY ?? 0)}
        //     //         onChange={(e) => {
        //     //           const val = -parseInt(e.target.value);
        //     //           const newAnim = { ...animationIn, slideDistanceY: val };
        //     //           setAnimationIn(newAnim);
        //     //           update_value({ animation: { in: newAnim, out: animationOut } });
        //     //         }}
        //     //       />
        //     //       <div className="theme-small-text">{animationIn.slideDistanceY}px</div>
        //     //     </div>


        //     //     <div>
        //     //       <label className="theme-small-text mt-2 w-8/12">Slide Distance Y slide bottom</label>
        //     //       <input
        //     //         className="kd-range-input"
        //     //         type="range"
        //     //         min={0}
        //     //         max={400}
        //     //         step={10}
        //     //         value={animationIn.slideDistanceY}
        //     //         onChange={(e) => {
        //     //           const val = parseInt(e.target.value);
        //     //           const newAnim = { ...animationIn, slideDistanceY: val };
        //     //           setAnimationIn(newAnim);
        //     //           update_value({ animation: { in: newAnim, out: animationOut } });
        //     //         }}
        //     //       />
        //     //       <div className="theme-small-text">{animationIn.slideDistanceY}px</div>
        //     //     </div>


        //     //   </div> */}
        //     //   {/* 👇 Input sliders for Animation In */}
        //     //   <div className="mb-4 space-y-2">
        //     //     {/* Duration - always show */}
        //     //     <div>
        //     //       <label className="theme-small-text w-8/12">In Duration (ms)</label>
        //     //       <input
        //     //         className="kd-range-input"
        //     //         type="range"
        //     //         min={100}
        //     //         max={5000}
        //     //         step={100}
        //     //         value={animationIn.duration}
        //     //         onChange={(e) => {
        //     //           const val = parseInt(e.target.value);
        //     //           const newAnim = { ...animationIn, duration: val };
        //     //           setAnimationIn(newAnim);
        //     //           update_value({ animation: { in: newAnim, out: animationOut } });
        //     //         }}
        //     //       />
        //     //       <div className="theme-small-text">{animationIn.duration} ms</div>
        //     //     </div>

        //     //     {/* Show only if Slide Left is selected */}
        //     //     {animationType === "Slide Left" && (
        //     //       <div>
        //     //         <label className="theme-small-text mt-2 w-8/12">Slide Distance X (Left)</label>
        //     //         <input
        //     //           className="kd-range-input"
        //     //           type="range"
        //     //           min={0}
        //     //           max={400}
        //     //           step={10}
        //     //           value={Math.abs(animationIn.slideDistanceX ?? 0)}
        //     //           onChange={(e) => {
        //     //             const val = -parseInt(e.target.value); // Negative for left
        //     //             const newAnim = { ...animationIn, slideDistanceX: val };
        //     //             setAnimationIn(newAnim);
        //     //             update_value({ animation: { in: newAnim, out: animationOut } });
        //     //           }}
        //     //         />
        //     //         <div className="theme-small-text">{animationIn.slideDistanceX}px</div>
        //     //       </div>
        //     //     )}

        //     //     {/* Slide Right */}
        //     //     {animationType === "Slide Right" && (
        //     //       <div>
        //     //         <label className="theme-small-text mt-2 w-8/12">Slide Distance X (Right)</label>
        //     //         <input
        //     //           className="kd-range-input"
        //     //           type="range"
        //     //           min={0}
        //     //           max={400}
        //     //           step={10}
        //     //           value={animationIn.slideDistanceX}
        //     //           onChange={(e) => {
        //     //             const val = parseInt(e.target.value); // Positive for right
        //     //             const newAnim = { ...animationIn, slideDistanceX: val };
        //     //             setAnimationIn(newAnim);
        //     //             update_value({ animation: { in: newAnim, out: animationOut } });
        //     //           }}
        //     //         />
        //     //         <div className="theme-small-text">{animationIn.slideDistanceX}px</div>
        //     //       </div>
        //     //     )}

        //     //     {/* Slide Top */}
        //     //     {animationType === "Slide Top" && (
        //     //       <div>
        //     //         <label className="theme-small-text mt-2 w-8/12">Slide Distance Y (Top)</label>
        //     //         <input
        //     //           className="kd-range-input"
        //     //           type="range"
        //     //           min={0}
        //     //           max={400}
        //     //           step={10}
        //     //           value={Math.abs(animationIn.slideDistanceY ?? 0)}
        //     //           onChange={(e) => {
        //     //             const val = -parseInt(e.target.value); // Negative for top
        //     //             const newAnim = { ...animationIn, slideDistanceY: val };
        //     //             setAnimationIn(newAnim);
        //     //             update_value({ animation: { in: newAnim, out: animationOut } });
        //     //           }}
        //     //         />
        //     //         <div className="theme-small-text">{animationIn.slideDistanceY}px</div>
        //     //       </div>
        //     //     )}

        //     //     {/* Slide Bottom */}
        //     //     {animationType === "Slide Bottom" && (
        //     //       <div>
        //     //         <label className="theme-small-text mt-2 w-8/12">Slide Distance Y (Bottom)</label>
        //     //         <input
        //     //           className="kd-range-input"
        //     //           type="range"
        //     //           min={0}
        //     //           max={400}
        //     //           step={10}
        //     //           value={animationIn.slideDistanceY}
        //     //           onChange={(e) => {
        //     //             const val = parseInt(e.target.value); // Positive for bottom
        //     //             const newAnim = { ...animationIn, slideDistanceY: val };
        //     //             setAnimationIn(newAnim);
        //     //             update_value({ animation: { in: newAnim, out: animationOut } });
        //     //           }}
        //     //         />
        //     //         <div className="theme-small-text">{animationIn.slideDistanceY}px</div>
        //     //       </div>
        //     //     )}
        //     //   </div>

        //     //   {/* 👇 Animation buttons with updated logic */}
        //     //   <div className="grid grid-cols-2 gap-2 mt-2">
        //     //     {/* Slide Left */}
        //     //     <div
        //     //       className={`animation-btn ${animationType === "Slide Left" ? "animation-btn-active" : ""}`}
        //     //       onClick={() => {
        //     //         const newAnim: AnimationState = {
        //     //           ...animationIn,
        //     //           type: "Slide",
        //     //           slideDistanceX: animationIn.slideDistanceX ?? -100,
        //     //           slideDistanceY: 0,
        //     //         };
        //     //         setanimationType("Slide Left");
        //     //         setAnimationIn(newAnim);
        //     //         update_value({ animationType: "Slide Left", animation: { in: newAnim, out: animationOut } });
        //     //       }}
        //     //     >
        //     //       <button>
        //     //         <div className="text-2xl"><LuArrowLeft /></div>
        //     //         <div className="text-sm mt-1">Slide Left</div>
        //     //       </button>
        //     //     </div>

        //     //     {/* Slide Right */}
        //     //     <div
        //     //       className={`animation-btn ${animationType === "Slide Right" ? "animation-btn-active" : ""}`}
        //     //       onClick={() => {
        //     //         const newAnim: AnimationState = {
        //     //           ...animationIn,
        //     //           type: "Slide",
        //     //           slideDistanceX: animationIn.slideDistanceX ?? 100,
        //     //           slideDistanceY: 0,
        //     //         };
        //     //         setanimationType("Slide Right");
        //     //         setAnimationIn(newAnim);
        //     //         update_value({ animationType: "Slide Right", animation: { in: newAnim, out: animationOut } });
        //     //       }}
        //     //     >
        //     //       <button>
        //     //         <div className="text-2xl"><LuArrowRight /></div>
        //     //         <div className="text-sm mt-1">Slide Right</div>
        //     //       </button>
        //     //     </div>

        //     //     {/* Slide Top */}
        //     //     <div
        //     //       className={`animation-btn ${animationType === "Slide Top" ? "animation-btn-active" : ""}`}
        //     //       onClick={() => {
        //     //         const newAnim: AnimationState = {
        //     //           ...animationIn,
        //     //           type: "Slide",
        //     //           slideDistanceX: 0,
        //     //           slideDistanceY: animationIn.slideDistanceY ?? -100,
        //     //         };
        //     //         setanimationType("Slide Top");
        //     //         setAnimationIn(newAnim);
        //     //         update_value({ animationType: "Slide Top", animation: { in: newAnim, out: animationOut } });
        //     //       }}
        //     //     >
        //     //       <button>
        //     //         <div className="text-2xl"><LuArrowUp /></div>
        //     //         <div className="text-sm mt-1">Slide Top</div>
        //     //       </button>
        //     //     </div>

        //     //     {/* Slide Bottom */}
        //     //     <div
        //     //       className={`animation-btn ${animationType === "Slide Bottom" ? "animation-btn-active" : ""}`}
        //     //       onClick={() => {
        //     //         const newAnim: AnimationState = {
        //     //           ...animationIn,
        //     //           type: "Slide",
        //     //           slideDistanceX: 0,
        //     //           slideDistanceY: animationIn.slideDistanceY ?? 100,
        //     //         };
        //     //         setanimationType("Slide Bottom");
        //     //         setAnimationIn(newAnim);
        //     //         update_value({ animationType: "Slide Bottom", animation: { in: newAnim, out: animationOut } });
        //     //       }}
        //     //     >
        //     //       <button>
        //     //         <div className="text-2xl"><LuArrowDown /></div>
        //     //         <div className="text-sm mt-1">Slide Bottom</div>
        //     //       </button>
        //     //     </div>

        //     //     {/* Fade In */}
        //     //     <div
        //     //       className={`animation-btn ${animationType === "Fade in" ? "animation-btn-active" : ""}`}
        //     //       onClick={() => {
        //     //         const newAnim: AnimationState = {
        //     //           ...animationIn,
        //     //           type: "Fade",
        //     //         };
        //     //         setanimationType("Fade in");
        //     //         setAnimationIn(newAnim);
        //     //         update_value({ animationType: "Fade in", animation: { in: newAnim, out: animationOut } });
        //     //       }}
        //     //     >
        //     //       <button>
        //     //         <div className="text-sm mt-1">Fade in</div>
        //     //       </button>
        //     //     </div>

        //     //     {/* Zoom In */}
        //     //     <div
        //     //       className={`animation-btn ${animationType === "Zoom in" ? "animation-btn-active" : ""}`}
        //     //       onClick={() => {
        //     //         const newAnim: AnimationState = {
        //     //           ...animationIn,
        //     //           type: "Zoom",
        //     //         };
        //     //         setanimationType("Zoom in");
        //     //         setAnimationIn(newAnim);
        //     //         update_value({ animationType: "Zoom in", animation: { in: newAnim, out: animationOut } });
        //     //       }}
        //     //     >
        //     //       <button>
        //     //         <div className="text-sm mt-1">Zoom in</div>
        //     //       </button>
        //     //     </div>

        //     //     {/* Zoom Out */}
        //     //     <div
        //     //       className={`animation-btn ${animationType === "Zoom out" ? "animation-btn-active" : ""}`}
        //     //       onClick={() => {
        //     //         const newAnim: AnimationState = {
        //     //           ...animationIn,
        //     //           type: "Zoom",
        //     //         };
        //     //         setanimationType("Zoom out");
        //     //         setAnimationIn(newAnim);
        //     //         update_value({ animationType: "Zoom out", animation: { in: newAnim, out: animationOut } });
        //     //       }}
        //     //     >
        //     //       <button>
        //     //         <div className="text-sm mt-1">Zoom out</div>
        //     //       </button>
        //     //     </div>
        //     //   </div>
        //     // </>
        //   )}

        //   {InOutactiveTab === "out" && (
        //     <>
        //       {/* 👇 Input sliders for Animation In */}
        //       <div className="mb-4 space-y-2">
        //         <div>
        //           <label className="theme-small-text  w-8/12">In Duration (ms)</label>
        //           <input
        //             className="kd-range-input"
        //             type="range"
        //             min={100}
        //             max={5000}
        //             step={100}
        //             value={animationOut.duration}
        //             onChange={(e) => {
        //               const val = parseInt(e.target.value);
        //               const newAnim = { ...animationOut, duration: val };
        //               setAnimationOut(newAnim);
        //               // update_value({ animation: { in: newAnim, out: animationOut } });
        //               update_value({ animation: { in: animationIn, out: newAnim } });
        //             }}
        //           />
        //           <div className="theme-small-text">{animationOut.duration} ms</div>
        //         </div>

        //         <div>
        //           <label className="theme-small-text mt-2 w-8/12">Slide Distance X</label>
        //           <input
        //             className="kd-range-input"
        //             type="range"
        //             min={-500}
        //             max={500}
        //             step={10}
        //             value={animationOut.slideDistanceX}
        //             onChange={(e) => {
        //               const val = parseInt(e.target.value);
        //               const newAnim = { ...animationOut, slideDistanceX: val };
        //               setAnimationOut(newAnim);
        //               // update_value({ animation: { in: newAnim, out: animationOut } });
        //               update_value({ animation: { in: animationIn, out: newAnim } });
        //             }}
        //           />
        //           <div className="theme-small-text">{animationOut.slideDistanceX}px</div>
        //         </div>

        //         <div>
        //           <label className="theme-small-text mt-2 w-8/12">Slide Distance Y</label>
        //           <input
        //             className="kd-range-input"
        //             type="range"
        //             min={-500}
        //             max={500}
        //             step={10}
        //             value={animationOut.slideDistanceY}
        //             onChange={(e) => {
        //               const val = parseInt(e.target.value);
        //               const newAnim = { ...animationOut, slideDistanceY: val };
        //               setAnimationOut(newAnim);
        //               // update_value({ animation: { in: newAnim, out: animationOut } });
        //               update_value({ animation: { in: animationIn, out: newAnim } });
        //             }}
        //           />
        //           <div className="theme-small-text">{animationOut.slideDistanceY}px</div>
        //         </div>
        //       </div>

        //       {/* 👇 Animation buttons with updated logic */}
        //       <div className="grid grid-cols-2 gap-2 mt-2">
        //         {/* Slide Left */}
        //         <div
        //           className={`animation-btn ${animationType === "Slide Left" ? "animation-btn-active" : ""}`}
        //           onClick={() => {
        //             const newAnim: AnimationState = {
        //               ...animationOut,
        //               type: "Slide",
        //               slideDistanceX: animationOut.slideDistanceX ?? -100,
        //               slideDistanceY: 0,
        //             };
        //             setanimationType("Slide Left");
        //             setAnimationOut(newAnim);
        //             update_value({ animationType: "Slide Left", animation: { in: animationIn, out: newAnim } });

        //           }}
        //         >
        //           <button>
        //             <div className="text-2xl"><LuArrowLeft /></div>
        //             <div className="text-sm mt-1">Slide Left</div>
        //           </button>
        //         </div>

        //         {/* Slide Right */}
        //         <div
        //           className={`animation-btn ${animationType === "Slide Right" ? "animation-btn-active" : ""}`}
        //           onClick={() => {
        //             const newAnim: AnimationState = {
        //               ...animationOut,
        //               type: "Slide",
        //               slideDistanceX: animationOut.slideDistanceX ?? 100,
        //               slideDistanceY: 0,
        //             };
        //             setanimationType("Slide Right");
        //             setAnimationOut(newAnim);
        //             update_value({ animationType: "Slide Right", animation: { in: newAnim, out: animationOut } });
        //           }}
        //         >
        //           <button>
        //             <div className="text-2xl"><LuArrowRight /></div>
        //             <div className="text-sm mt-1">Slide Right</div>
        //           </button>
        //         </div>

        //         {/* Slide Top */}
        //         <div
        //           className={`animation-btn ${animationType === "Slide Top" ? "animation-btn-active" : ""}`}
        //           onClick={() => {
        //             const newAnim: AnimationState = {
        //               ...animationOut,
        //               type: "Slide",
        //               slideDistanceX: 0,
        //               slideDistanceY: animationOut.slideDistanceY ?? -100,
        //             };
        //             setanimationType("Slide Top");
        //             setAnimationOut(newAnim);
        //             update_value({ animationType: "Slide Top", animation: { in: newAnim, out: animationOut } });
        //           }}
        //         >
        //           <button>
        //             <div className="text-2xl"><LuArrowUp /></div>
        //             <div className="text-sm mt-1">Slide Top</div>
        //           </button>
        //         </div>

        //         {/* Slide Bottom */}
        //         <div
        //           className={`animation-btn ${animationType === "Slide Bottom" ? "animation-btn-active" : ""}`}
        //           onClick={() => {
        //             const newAnim: AnimationState = {
        //               ...animationOut,
        //               type: "Slide",
        //               slideDistanceX: 0,
        //               slideDistanceY: animationOut.slideDistanceY ?? 100,
        //             };
        //             setanimationType("Slide Bottom");
        //             setAnimationOut(newAnim);
        //             update_value({ animationType: "Slide Bottom", animation: { in: newAnim, out: animationOut } });
        //           }}
        //         >
        //           <button>
        //             <div className="text-2xl"><LuArrowDown /></div>
        //             <div className="text-sm mt-1">Slide Bottom</div>
        //           </button>
        //         </div>

        //         {/* Fade In */}
        //         <div
        //           className={`animation-btn ${animationType === "Fade in" ? "animation-btn-active" : ""}`}
        //           onClick={() => {
        //             const newAnim: AnimationState = {
        //               ...animationOut,
        //               type: "Fade",
        //             };
        //             setanimationType("Fade in");
        //             setAnimationOut(newAnim);
        //             update_value({ animationType: "Fade in", animation: { in: newAnim, out: animationOut } });
        //           }}
        //         >
        //           <button>
        //             <div className="text-sm mt-1">Fade in</div>
        //           </button>
        //         </div>

        //         {/* Zoom In */}
        //         <div
        //           className={`animation-btn ${animationType === "Zoom in" ? "animation-btn-active" : ""}`}
        //           onClick={() => {
        //             const newAnim: AnimationState = {
        //               ...animationOut,
        //               type: "Zoom",
        //             };
        //             setanimationType("Zoom in");
        //             setAnimationOut(newAnim);
        //             update_value({ animationType: "Zoom in", animation: { in: newAnim, out: animationOut } });
        //           }}
        //         >
        //           <button>
        //             <div className="text-sm mt-1">Zoom in</div>
        //           </button>
        //         </div>

        //         {/* Zoom Out */}
        //         <div
        //           className={`animation-btn ${animationType === "Zoom out" ? "animation-btn-active" : ""}`}
        //           onClick={() => {
        //             const newAnim: AnimationState = {
        //               ...animationOut,
        //               type: "Zoom",
        //             };
        //             setanimationType("Zoom out");
        //             setAnimationOut(newAnim);
        //             update_value({ animationType: "Zoom out", animation: { in: newAnim, out: animationOut } });
        //           }}
        //         >
        //           <button>
        //             <div className="text-sm mt-1">Zoom out</div>
        //           </button>
        //         </div>
        //       </div>
        //     </>
        //   )}

        // </>
      )}


    </div>
  );
};

export default ImageEditTool;

