// import React, {
//     useState, useEffect,
//     //  useRef 
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../app/store/store";
// import { updateClip } from "../../../app/store/clipsSlice";
// import { LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp } from "react-icons/lu";
// const AnimationHelper: React.FC = () => {

//     const Activeid = useSelector(
//         (state: RootState) => state.editorTool.Activeid
//     );
//     const dispatch = useDispatch();

//     const Allclips = useSelector(
//         (state: RootState) => state.slices.present.Allclips
//     );
//     const [animationType, setanimationType] = useState('');
//     type AnimationType = "None" | "Fade" | "Zoom" | "Slide";
//     interface AnimationState {
//         type: AnimationType;
//         duration: number;
//         slideDistanceX?: number;
//         slideDistanceY?: number;
//     }

//     const [animationIn, setAnimationIn] = useState<AnimationState>({
//         type: "None",
//         duration: 1,
//         slideDistanceX: 0,
//         slideDistanceY: 0,
//     });

//     const [animationOut, setAnimationOut] = useState<AnimationState>({
//         type: "None",
//         duration: 1,
//         slideDistanceX: 0,
//         slideDistanceY: 0,
//     });

//     useEffect(() => {
//         const activeImage = Allclips.find((image) => image.id === Activeid);

//         if (activeImage?.type === "image") {
//             setanimationType(activeImage.properties.animationType)

//             const { animation } = activeImage.properties;
//             setAnimationIn({
//                 type: animation?.in?.type ?? "None",
//                 duration: animation?.in?.duration ?? 60,
//                 slideDistanceX: animation?.in?.slideDistanceX ?? 0,
//                 slideDistanceY: animation?.in?.slideDistanceY ?? 0,
//             });
//             setAnimationOut({
//                 type: animation?.out?.type ?? "None",
//                 duration: animation?.out?.duration ?? 60,
//                 slideDistanceX: animation?.out?.slideDistanceX ?? 0,
//                 slideDistanceY: animation?.out?.slideDistanceY ?? 0,
//             });
//         }


//     }, [Activeid, Allclips]);


//     // update value function

//     const update_value = (updateproperties: Partial<any>) => {
//         dispatch(
//             updateClip({
//                 id: Activeid,
//                 properties: {
//                     animation: {
//                         in: animationIn,
//                         out: animationOut,
//                     },
//                     animationType,
//                     ...updateproperties
//                 },
//             })
//         );

//     }


//     const [InOutactiveTab, InOutsetActiveTab] = useState<"in" | "out">("in");

//     return (

//         <>
//             <div className="kd-tab-list style-2">
//                 <button
//                     onClick={() => InOutsetActiveTab("in")}
//                     className={`kd-tab-btn ${InOutactiveTab === "in" ? "active" : ""}`}
//                 >
//                     In
//                 </button>
//                 <button
//                     onClick={() => InOutsetActiveTab("out")}
//                     className={`kd-tab-btn ${InOutactiveTab === "out" ? "active" : ""}`}
//                 >
//                     Out
//                 </button>
//             </div>



//             {InOutactiveTab === "in" && (
//                 <>
//                     {/* 👇 Input sliders for Animation In */}
//                     <div className="mb-4 space-y-2">
//                         {/* Duration - always show */}
//                         <div>
//                             <label className="theme-small-text w-8/12">In Duration (ms)</label>
//                             <input
//                                 className="kd-range-input"
//                                 type="range"
//                                 min={100}
//                                 max={5000}
//                                 step={100}
//                                 value={animationIn.duration}
//                                 onChange={(e) => {
//                                     const val = parseInt(e.target.value);
//                                     const newAnim = { ...animationIn, duration: val };
//                                     setAnimationIn(newAnim);
//                                     update_value({ animation: { in: newAnim, out: animationOut } });
//                                 }}
//                             />
//                             <div className="theme-small-text">{animationIn.duration} ms</div>
//                         </div>

//                         {/* Show only if Slide Left is selected */}
//                         {animationType === "Slide Left" && (
//                             <div>
//                                 <label className="theme-small-text mt-2 w-8/12">Slide Distance X (Left)</label>
//                                 <input
//                                     className="kd-range-input"
//                                     type="range"
//                                     min={0}
//                                     max={400}
//                                     step={10}
//                                     value={Math.abs(animationIn.slideDistanceX ?? 0)}
//                                     onChange={(e) => {
//                                         const val = -parseInt(e.target.value); // Negative for left
//                                         const newAnim = { ...animationIn, slideDistanceX: val };
//                                         setAnimationIn(newAnim);
//                                         update_value({ animation: { in: newAnim, out: animationOut } });
//                                     }}
//                                 />
//                                 <div className="theme-small-text">{animationIn.slideDistanceX}px</div>
//                             </div>
//                         )}

//                         {/* Slide Right */}
//                         {animationType === "Slide Right" && (
//                             <div>
//                                 <label className="theme-small-text mt-2 w-8/12">Slide Distance X (Right)</label>
//                                 <input
//                                     className="kd-range-input"
//                                     type="range"
//                                     min={0}
//                                     max={400}
//                                     step={10}
//                                     value={animationIn.slideDistanceX}
//                                     onChange={(e) => {
//                                         const val = parseInt(e.target.value); // Positive for right
//                                         const newAnim = { ...animationIn, slideDistanceX: val };
//                                         setAnimationIn(newAnim);
//                                         update_value({ animation: { in: newAnim, out: animationOut } });
//                                     }}
//                                 />
//                                 <div className="theme-small-text">{animationIn.slideDistanceX}px</div>
//                             </div>
//                         )}

//                         {/* Slide Top */}
//                         {animationType === "Slide Top" && (
//                             <div>
//                                 <label className="theme-small-text mt-2 w-8/12">Slide Distance Y (Top)</label>
//                                 <input
//                                     className="kd-range-input"
//                                     type="range"
//                                     min={0}
//                                     max={400}
//                                     step={10}
//                                     value={Math.abs(animationIn.slideDistanceY ?? 0)}
//                                     onChange={(e) => {
//                                         const val = -parseInt(e.target.value); // Negative for top
//                                         const newAnim = { ...animationIn, slideDistanceY: val };
//                                         setAnimationIn(newAnim);
//                                         update_value({ animation: { in: newAnim, out: animationOut } });
//                                     }}
//                                 />
//                                 <div className="theme-small-text">{animationIn.slideDistanceY}px</div>
//                             </div>
//                         )}

//                         {/* Slide Bottom */}
//                         {animationType === "Slide Bottom" && (
//                             <div>
//                                 <label className="theme-small-text mt-2 w-8/12">Slide Distance Y (Bottom)</label>
//                                 <input
//                                     className="kd-range-input"
//                                     type="range"
//                                     min={0}
//                                     max={400}
//                                     step={10}
//                                     value={animationIn.slideDistanceY}
//                                     onChange={(e) => {
//                                         const val = parseInt(e.target.value); // Positive for bottom
//                                         const newAnim = { ...animationIn, slideDistanceY: val };
//                                         setAnimationIn(newAnim);
//                                         update_value({ animation: { in: newAnim, out: animationOut } });
//                                     }}
//                                 />
//                                 <div className="theme-small-text">{animationIn.slideDistanceY}px</div>
//                             </div>
//                         )}
//                     </div>

//                     {/* 👇 Animation buttons with updated logic */}
//                     <div className="grid grid-cols-2 gap-2 mt-2">
//                         {/* Slide Left */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Left" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationIn,
//                                     type: "Slide",
//                                     slideDistanceX: animationIn.slideDistanceX ?? -100,
//                                     slideDistanceY: 0,
//                                 };
//                                 setanimationType("Slide Left");
//                                 setAnimationIn(newAnim);
//                                 update_value({ animationType: "Slide Left", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowLeft /></div>
//                                 <div className="text-sm mt-1">Slide Left</div>
//                             </button>
//                         </div>

//                         {/* Slide Right */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Right" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationIn,
//                                     type: "Slide",
//                                     slideDistanceX: animationIn.slideDistanceX ?? 100,
//                                     slideDistanceY: 0,
//                                 };
//                                 setanimationType("Slide Right");
//                                 setAnimationIn(newAnim);
//                                 update_value({ animationType: "Slide Right", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowRight /></div>
//                                 <div className="text-sm mt-1">Slide Right</div>
//                             </button>
//                         </div>

//                         {/* Slide Top */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Top" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationIn,
//                                     type: "Slide",
//                                     slideDistanceX: 0,
//                                     slideDistanceY: animationIn.slideDistanceY ?? -100,
//                                 };
//                                 setanimationType("Slide Top");
//                                 setAnimationIn(newAnim);
//                                 update_value({ animationType: "Slide Top", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowUp /></div>
//                                 <div className="text-sm mt-1">Slide Top</div>
//                             </button>
//                         </div>

//                         {/* Slide Bottom */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Bottom" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationIn,
//                                     type: "Slide",
//                                     slideDistanceX: 0,
//                                     slideDistanceY: animationIn.slideDistanceY ?? 100,
//                                 };
//                                 setanimationType("Slide Bottom");
//                                 setAnimationIn(newAnim);
//                                 update_value({ animationType: "Slide Bottom", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowDown /></div>
//                                 <div className="text-sm mt-1">Slide Bottom</div>
//                             </button>
//                         </div>

//                         {/* Fade In */}
//                         <div
//                             className={`animation-btn ${animationType === "Fade in" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationIn,
//                                     type: "Fade",
//                                 };
//                                 setanimationType("Fade in");
//                                 setAnimationIn(newAnim);
//                                 update_value({ animationType: "Fade in", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-sm mt-1">Fade in</div>
//                             </button>
//                         </div>

//                         {/* Zoom In */}
//                         <div
//                             className={`animation-btn ${animationType === "Zoom in" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationIn,
//                                     type: "Zoom",
//                                 };
//                                 setanimationType("Zoom in");
//                                 setAnimationIn(newAnim);
//                                 update_value({ animationType: "Zoom in", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-sm mt-1">Zoom in</div>
//                             </button>
//                         </div>

//                         {/* Zoom Out */}
//                         <div
//                             className={`animation-btn ${animationType === "Zoom out" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationIn,
//                                     type: "Zoom",
//                                 };
//                                 setanimationType("Zoom out");
//                                 setAnimationIn(newAnim);
//                                 update_value({ animationType: "Zoom out", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-sm mt-1">Zoom out</div>
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}

//             {InOutactiveTab === "out" && (
//                 <>
//                     {/* 👇 Input sliders for Animation In */}
//                     <div className="mb-4 space-y-2">
//                         <div>
//                             <label className="theme-small-text  w-8/12">In Duration (ms)</label>
//                             <input
//                                 className="kd-range-input"
//                                 type="range"
//                                 min={100}
//                                 max={5000}
//                                 step={100}
//                                 value={animationOut.duration}
//                                 onChange={(e) => {
//                                     const val = parseInt(e.target.value);
//                                     const newAnim = { ...animationOut, duration: val };
//                                     setAnimationOut(newAnim);
//                                     // update_value({ animation: { in: newAnim, out: animationOut } });
//                                     update_value({ animation: { in: animationIn, out: newAnim } });
//                                 }}
//                             />
//                             <div className="theme-small-text">{animationOut.duration} ms</div>
//                         </div>

//                         <div>
//                             <label className="theme-small-text mt-2 w-8/12">Slide Distance X</label>
//                             <input
//                                 className="kd-range-input"
//                                 type="range"
//                                 min={-500}
//                                 max={500}
//                                 step={10}
//                                 value={animationOut.slideDistanceX}
//                                 onChange={(e) => {
//                                     const val = parseInt(e.target.value);
//                                     const newAnim = { ...animationOut, slideDistanceX: val };
//                                     setAnimationOut(newAnim);
//                                     // update_value({ animation: { in: newAnim, out: animationOut } });
//                                     update_value({ animation: { in: animationIn, out: newAnim } });
//                                 }}
//                             />
//                             <div className="theme-small-text">{animationOut.slideDistanceX}px</div>
//                         </div>

//                         <div>
//                             <label className="theme-small-text mt-2 w-8/12">Slide Distance Y</label>
//                             <input
//                                 className="kd-range-input"
//                                 type="range"
//                                 min={-500}
//                                 max={500}
//                                 step={10}
//                                 value={animationOut.slideDistanceY}
//                                 onChange={(e) => {
//                                     const val = parseInt(e.target.value);
//                                     const newAnim = { ...animationOut, slideDistanceY: val };
//                                     setAnimationOut(newAnim);
//                                     // update_value({ animation: { in: newAnim, out: animationOut } });
//                                     update_value({ animation: { in: animationIn, out: newAnim } });
//                                 }}
//                             />
//                             <div className="theme-small-text">{animationOut.slideDistanceY}px</div>
//                         </div>
//                     </div>

//                     {/* 👇 Animation buttons with updated logic */}
//                     <div className="grid grid-cols-2 gap-2 mt-2">
//                         {/* Slide Left */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Left" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationOut,
//                                     type: "Slide",
//                                     slideDistanceX: animationOut.slideDistanceX ?? -100,
//                                     slideDistanceY: 0,
//                                 };
//                                 setanimationType("Slide Left");
//                                 setAnimationOut(newAnim);
//                                 update_value({ animationType: "Slide Left", animation: { in: animationIn, out: newAnim } });

//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowLeft /></div>
//                                 <div className="text-sm mt-1">Slide Left</div>
//                             </button>
//                         </div>

//                         {/* Slide Right */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Right" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationOut,
//                                     type: "Slide",
//                                     slideDistanceX: animationOut.slideDistanceX ?? 100,
//                                     slideDistanceY: 0,
//                                 };
//                                 setanimationType("Slide Right");
//                                 setAnimationOut(newAnim);
//                                 update_value({ animationType: "Slide Right", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowRight /></div>
//                                 <div className="text-sm mt-1">Slide Right</div>
//                             </button>
//                         </div>

//                         {/* Slide Top */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Top" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationOut,
//                                     type: "Slide",
//                                     slideDistanceX: 0,
//                                     slideDistanceY: animationOut.slideDistanceY ?? -100,
//                                 };
//                                 setanimationType("Slide Top");
//                                 setAnimationOut(newAnim);
//                                 update_value({ animationType: "Slide Top", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowUp /></div>
//                                 <div className="text-sm mt-1">Slide Top</div>
//                             </button>
//                         </div>

//                         {/* Slide Bottom */}
//                         <div
//                             className={`animation-btn ${animationType === "Slide Bottom" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationOut,
//                                     type: "Slide",
//                                     slideDistanceX: 0,
//                                     slideDistanceY: animationOut.slideDistanceY ?? 100,
//                                 };
//                                 setanimationType("Slide Bottom");
//                                 setAnimationOut(newAnim);
//                                 update_value({ animationType: "Slide Bottom", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-2xl"><LuArrowDown /></div>
//                                 <div className="text-sm mt-1">Slide Bottom</div>
//                             </button>
//                         </div>

//                         {/* Fade In */}
//                         <div
//                             className={`animation-btn ${animationType === "Fade in" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationOut,
//                                     type: "Fade",
//                                 };
//                                 setanimationType("Fade in");
//                                 setAnimationOut(newAnim);
//                                 update_value({ animationType: "Fade in", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-sm mt-1">Fade in</div>
//                             </button>
//                         </div>

//                         {/* Zoom In */}
//                         <div
//                             className={`animation-btn ${animationType === "Zoom in" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationOut,
//                                     type: "Zoom",
//                                 };
//                                 setanimationType("Zoom in");
//                                 setAnimationOut(newAnim);
//                                 update_value({ animationType: "Zoom in", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-sm mt-1">Zoom in</div>
//                             </button>
//                         </div>

//                         {/* Zoom Out */}
//                         <div
//                             className={`animation-btn ${animationType === "Zoom out" ? "animation-btn-active" : ""}`}
//                             onClick={() => {
//                                 const newAnim: AnimationState = {
//                                     ...animationOut,
//                                     type: "Zoom",
//                                 };
//                                 setanimationType("Zoom out");
//                                 setAnimationOut(newAnim);
//                                 update_value({ animationType: "Zoom out", animation: { in: newAnim, out: animationOut } });
//                             }}
//                         >
//                             <button>
//                                 <div className="text-sm mt-1">Zoom out</div>
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}

//         </>
//     )
// }

// export default AnimationHelper;


// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../app/store/store";
// import { updateClip } from "../../../app/store/clipsSlice";
// import { LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp } from "react-icons/lu";

// type AnimationType = "None" | "Fade" | "Zoom" | "Slide";
// interface AnimationState {
//     type: AnimationType;
//     duration: number;
//     slideDistanceX?: number;
//     slideDistanceY?: number;
// }

// const AnimationHelper: React.FC = () => {
//     const Activeid = useSelector((state: RootState) => state.editorTool.Activeid);
//     const Allclips = useSelector((state: RootState) => state.slices.present.Allclips);
//     const dispatch = useDispatch();

//     const [animationType, setanimationType] = useState<string>("");
//     const [animationIn, setAnimationIn] = useState<AnimationState>({
//         type: "None",
//         duration: 1,
//         slideDistanceX: 0,
//         slideDistanceY: 0,
//     });

//     const [animationOut, setAnimationOut] = useState<AnimationState>({
//         type: "None",
//         duration: 1,
//         slideDistanceX: 0,
//         slideDistanceY: 0,
//     });

//     const [InOutactiveTab, InOutsetActiveTab] = useState<"in" | "out">("in");

//     useEffect(() => {
//         const activeImage = Allclips.find((image) => image.id === Activeid);
//         if (activeImage?.type === "image") {
//             setanimationType(activeImage.properties.animationType);
//             const { animation } = activeImage.properties;
//             setAnimationIn({
//                 type: animation?.in?.type ?? "None",
//                 duration: animation?.in?.duration ?? 60,
//                 slideDistanceX: animation?.in?.slideDistanceX ?? 0,
//                 slideDistanceY: animation?.in?.slideDistanceY ?? 0,
//             });
//             setAnimationOut({
//                 type: animation?.out?.type ?? "None",
//                 duration: animation?.out?.duration ?? 60,
//                 slideDistanceX: animation?.out?.slideDistanceX ?? 0,
//                 slideDistanceY: animation?.out?.slideDistanceY ?? 0,
//             });
//         }
//     }, [Activeid, Allclips]);

//     const update_value = (updateproperties: Partial<any>) => {
//         dispatch(
//             updateClip({
//                 id: Activeid,
//                 properties: {
//                     animation: { in: animationIn, out: animationOut },
//                     animationType,
//                     ...updateproperties,
//                 },
//             })
//         );
//     };

//     const slideConfigs = {
//         "Slide Left": { key: "slideDistanceX", label: "Slide Distance X (Left)", sign: -1 },
//         "Slide Right": { key: "slideDistanceX", label: "Slide Distance X (Right)", sign: 1 },
//         "Slide Top": { key: "slideDistanceY", label: "Slide Distance Y (Top)", sign: -1 },
//         "Slide Bottom": { key: "slideDistanceY", label: "Slide Distance Y (Bottom)", sign: 1 },
//     };

//     type SlideConfigKey = keyof typeof slideConfigs;
//     const renderSlideControl = (type: SlideConfigKey) => {
//         const config = slideConfigs[type];
//         if (!config) return null;

//         const rawVal = animationIn[config.key as keyof typeof animationIn];
//         const val = typeof rawVal === "number" ? rawVal : 0;

//         return (
//             <div>
//                 <label className="theme-small-text mt-2 w-8/12">{config.label}</label>
//                 <input
//                     className="kd-range-input"
//                     type="range"
//                     min={0}
//                     max={400}
//                     step={10}
//                     value={Math.abs(val)}
//                     onChange={(e) => {
//                         const newVal = config.sign * parseInt(e.target.value);
//                         const newAnim = {
//                             ...animationIn,
//                             [config.key]: newVal,
//                             ...(config.key === "slideDistanceX" ? { slideDistanceY: 0 } : { slideDistanceX: 0 }),
//                         };
//                         setAnimationIn(newAnim);
//                         update_value({ animation: { in: newAnim, out: animationOut } });
//                     }}

//                 />
//                 {/* <div className="theme-small-text">{val}px</div> */}
//                 <div className="theme-small-text">{Math.abs(val)}px</div>

//             </div>
//         );
//     };


//     const renderAnimationButton = (
//         label: string,
//         newType: string,
//         icon?: React.ReactNode
//     ) => {
//         const slideData: Partial<typeof animationIn> = { type: newType as any };

//         // Ensure only one direction is active at a time
//         if (label.includes("Left")) {
//             slideData.slideDistanceX = -100;
//             slideData.slideDistanceY = 0;
//         }
//         if (label.includes("Right")) {
//             slideData.slideDistanceX = 100;
//             slideData.slideDistanceY = 0;
//         }
//         if (label.includes("Top")) {
//             slideData.slideDistanceY = -100;
//             slideData.slideDistanceX = 0;
//         }
//         if (label.includes("Bottom")) {
//             slideData.slideDistanceY = 100;
//             slideData.slideDistanceX = 0;
//         }

//         return (
//             <div
//                 className={`animation-btn ${animationType === label ? "animation-btn-active" : ""}`}
//                 onClick={() => {
//                     const newAnim = { ...animationIn, ...slideData };
//                     setanimationType(label);
//                     setAnimationIn(newAnim);
//                     update_value({ animationType: label, animation: { in: newAnim, out: animationOut } });
//                 }}
//             >
//                 <button>
//                     {icon && <div className="text-2xl">{icon}</div>}
//                     <div className="text-sm mt-1">{label}</div>
//                 </button>
//             </div>
//         );
//     };

//     return (
//         <>
//             <div className="kd-tab-list style-2">
//                 {["in", "out"].map((tab) => (
//                     <button
//                         key={tab}
//                         onClick={() => InOutsetActiveTab(tab as "in" | "out")}
//                         className={`kd-tab-btn ${InOutactiveTab === tab ? "active" : ""}`}
//                     >
//                         {tab.toUpperCase()}
//                     </button>
//                 ))}
//             </div>

//             {InOutactiveTab === "in" && (
//                 <>
//                     <div className="mb-4 space-y-2">
//                         <div>
//                             <label className="theme-small-text w-8/12">In Duration (ms)</label>
//                             <input
//                                 className="kd-range-input"
//                                 type="range"
//                                 min={1}
//                                 max={300}
//                                 step={1}
//                                 value={animationIn.duration}
//                                 onChange={(e) => {
//                                     const val = parseInt(e.target.value);
//                                     const newAnim = { ...animationIn, duration: val };
//                                     setAnimationIn(newAnim);
//                                     update_value({ animation: { in: newAnim, out: animationOut } });
//                                 }}
//                             />
//                             <div className="theme-small-text">
//                                 {(animationIn.duration / 30).toFixed(2)}s
//                             </div>
//                         </div>
//                         {(["Slide Left", "Slide Right", "Slide Top", "Slide Bottom"].includes(animationType) &&
//                             renderSlideControl(animationType as "Slide Left" | "Slide Right" | "Slide Top" | "Slide Bottom"))}
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 mt-2">
//                         {renderAnimationButton("Slide Left", "Slide", <LuArrowLeft />)}
//                         {renderAnimationButton("Slide Right", "Slide", <LuArrowRight />)}
//                         {renderAnimationButton("Slide Top", "Slide", <LuArrowUp />)}
//                         {renderAnimationButton("Slide Bottom", "Slide", <LuArrowDown />)}
//                         {renderAnimationButton("Fade in", "Fade")}
//                         {renderAnimationButton("Zoom in", "Zoom")}
//                         {renderAnimationButton("Zoom out", "Zoom")}
//                     </div>
//                 </>
//             )}

//             {InOutactiveTab === "out" && (
//                 <>
//                     <div className="mb-4 space-y-2">
//                         <div>
//                             <label className="theme-small-text w-8/12">Out Duration (ms)</label>
//                             <input
//                                 className="kd-range-input"
//                                 type="range"
//                                 min={1}
//                                 max={300}
//                                 step={1}
//                                 value={animationOut.duration}
//                                 onChange={(e) => {
//                                     const val = parseInt(e.target.value);
//                                     const newAnim = { ...animationOut, duration: val };
//                                     setAnimationOut(newAnim);
//                                     update_value({ animation: { in: animationIn, out: newAnim } });
//                                 }}
//                             />
//                             <div className="theme-small-text">
//                                 {(animationOut.duration / 30).toFixed(2)}s
//                             </div>
//                         </div>

//                         {(["Slide Left", "Slide Right", "Slide Top", "Slide Bottom"].includes(animationType) &&
//                             (() => {
//                                 const config = slideConfigs[animationType as SlideConfigKey];
//                                 const rawVal = animationOut[config.key as keyof typeof animationOut];
//                                 const val = typeof rawVal === "number" ? rawVal : 0;

//                                 return (
//                                     <div>
//                                         <label className="theme-small-text mt-2 w-8/12">{config.label}</label>
//                                         <input
//                                             className="kd-range-input"
//                                             type="range"
//                                             min={0}
//                                             max={400}
//                                             step={10}
//                                             value={Math.abs(val)}
//                                             onChange={(e) => {
//                                                 const newVal = config.sign * parseInt(e.target.value);
//                                                 const newAnim = {
//                                                     ...animationOut,
//                                                     [config.key]: newVal,
//                                                     ...(config.key === "slideDistanceX"
//                                                         ? { slideDistanceY: 0 }
//                                                         : { slideDistanceX: 0 }),
//                                                 };
//                                                 setAnimationOut(newAnim);
//                                                 update_value({ animation: { in: animationIn, out: newAnim } });
//                                             }}
//                                         />
//                                         <div className="theme-small-text">{Math.abs(val)}px</div>
//                                     </div>
//                                 );
//                             })())}
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 mt-2">
//                         {renderAnimationButton("Slide Left", "Slide", <LuArrowLeft />)}
//                         {renderAnimationButton("Slide Right", "Slide", <LuArrowRight />)}
//                         {renderAnimationButton("Slide Top", "Slide", <LuArrowUp />)}
//                         {renderAnimationButton("Slide Bottom", "Slide", <LuArrowDown />)}
//                         {renderAnimationButton("Fade out", "Fade")}
//                         {renderAnimationButton("Zoom in", "Zoom")}
//                         {renderAnimationButton("Zoom out", "Zoom")}
//                     </div>
//                 </>
//             )}

//         </>
//     );
// };

// export default AnimationHelper;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { updateClip } from "../../../app/store/clipsSlice";
import { LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp } from "react-icons/lu";

type AnimationType = "None" | "Fade" | "Zoom" | "Slide";
interface AnimationState {
    type: AnimationType;
    duration: number;
    slideDistanceX?: number;
    slideDistanceY?: number;
}

const AnimationHelper: React.FC = () => {
    const Activeid = useSelector((state: RootState) => state.editorTool.Activeid);
    const Allclips = useSelector((state: RootState) => state.slices.present.Allclips);
    const dispatch = useDispatch();

    const [animationTypeIn, setAnimationTypeIn] = useState<string>("");
    const [animationTypeOut, setAnimationTypeOut] = useState<string>("");
    const [animationIn, setAnimationIn] = useState<AnimationState>({
        type: "None",
        duration: 60,
        slideDistanceX: 0,
        slideDistanceY: 0,
    });

    const [animationOut, setAnimationOut] = useState<AnimationState>({
        type: "None",
        duration: 60,
        slideDistanceX: 0,
        slideDistanceY: 0,
    });

    const [InOutactiveTab, InOutsetActiveTab] = useState<"in" | "out">("in");

    useEffect(() => {
        const activeImage = Allclips.find((image) => image.id === Activeid);
        if (activeImage?.type === "image") {
            const { animation } = activeImage.properties;
            setAnimationIn({
                type: animation?.in?.type ?? "None",
                duration: animation?.in?.duration ?? 60,
                slideDistanceX: animation?.in?.slideDistanceX ?? 0,
                slideDistanceY: animation?.in?.slideDistanceY ?? 0,
            });
            setAnimationOut({
                type: animation?.out?.type ?? "None",
                duration: animation?.out?.duration ?? 60,
                slideDistanceX: animation?.out?.slideDistanceX ?? 0,
                slideDistanceY: animation?.out?.slideDistanceY ?? 0,
            });
        }
    }, [Activeid, Allclips]);

    const update_value = (updateproperties: Partial<any>) => {
        dispatch(
            updateClip({
                id: Activeid,
                properties: {
                    animation: { in: animationIn, out: animationOut },
                    ...updateproperties,
                },
            })
        );
    };

    const slideConfigs = {
        "Slide Left": { key: "slideDistanceX", label: "Slide Distance X (Left)", sign: -1 },
        "Slide Right": { key: "slideDistanceX", label: "Slide Distance X (Right)", sign: 1 },
        "Slide Top": { key: "slideDistanceY", label: "Slide Distance Y (Top)", sign: -1 },
        "Slide Bottom": { key: "slideDistanceY", label: "Slide Distance Y (Bottom)", sign: 1 },
    };

    const renderAnimationButton = (
        label: string,
        newType: string,
        icon?: React.ReactNode,
        target: "in" | "out" = "in"
    ) => {
        const isActive = target === "in" ? animationTypeIn === label : animationTypeOut === label;
        const currentAnim = target === "in" ? animationIn : animationOut;
        const setAnim = target === "in" ? setAnimationIn : setAnimationOut;
        const setType = target === "in" ? setAnimationTypeIn : setAnimationTypeOut;

        const slideData: Partial<AnimationState> = { type: newType as AnimationType };

        if (label.includes("Left")) {
            slideData.slideDistanceX = -100;
            slideData.slideDistanceY = 0;
        }
        if (label.includes("Right")) {
            slideData.slideDistanceX = 100;
            slideData.slideDistanceY = 0;
        }
        if (label.includes("Top")) {
            slideData.slideDistanceY = -100;
            slideData.slideDistanceX = 0;
        }
        if (label.includes("Bottom")) {
            slideData.slideDistanceY = 100;
            slideData.slideDistanceX = 0;
        }

        return (
            <div
                className={`animation-btn ${isActive ? "animation-btn-active" : ""}`}
                onClick={() => {
                    const newAnim = { ...currentAnim, ...slideData };
                    setAnim(newAnim);
                    setType(label);
                    update_value({
                        animation: {
                            in: target === "in" ? newAnim : animationIn,
                            out: target === "out" ? newAnim : animationOut,
                        },
                        ...(target === "in" ? { animationTypeIn: label } : { animationTypeOut: label }),
                    });
                }}
            >
                <button>
                    {icon && <div className="text-2xl">{icon}</div>}
                    <div className="text-sm mt-1">{label}</div>
                </button>
            </div>
        );
    };

    const renderSlideControl = (type: keyof typeof slideConfigs, target: "in" | "out") => {
        const config = slideConfigs[type];
        const anim = target === "in" ? animationIn : animationOut;
        const setAnim = target === "in" ? setAnimationIn : setAnimationOut;

        const rawVal = anim[config.key as keyof AnimationState];
        const val = typeof rawVal === "number" ? rawVal : 0;

        return (
            <div>
                <label className="theme-small-text mt-2 w-8/12">{config.label}</label>
                <input
                    className="kd-range-input"
                    type="range"
                    min={0}
                    max={400}
                    step={10}
                    value={Math.abs(val)}
                    onChange={(e) => {
                        const newVal = config.sign * parseInt(e.target.value);
                        const newAnim = {
                            ...anim,
                            [config.key]: newVal,
                            ...(config.key === "slideDistanceX" ? { slideDistanceY: 0 } : { slideDistanceX: 0 }),
                        };
                        setAnim(newAnim);
                        update_value({
                            animation: {
                                in: target === "in" ? newAnim : animationIn,
                                out: target === "out" ? newAnim : animationOut,
                            },
                        });
                    }}
                />
                <div className="theme-small-text">{Math.abs(val)}px</div>
            </div>
        );
    };

    return (
        <>
            <div className="kd-tab-list style-2">
                {[
                    { tab: "in", label: "IN" },
                    { tab: "out", label: "OUT" },
                ].map(({ tab, label }) => (
                    <button
                        key={tab}
                        onClick={() => InOutsetActiveTab(tab as "in" | "out")}
                        className={`kd-tab-btn ${InOutactiveTab === tab ? "active" : ""}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {InOutactiveTab === "in" && (
                <>
                    <div className="mb-4 space-y-2">
                        <label className="theme-small-text w-8/12">In Duration (ms)</label>
                        <input
                            className="kd-range-input"
                            type="range"
                            min={1}
                            max={300}
                            step={1}
                            value={animationIn.duration}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const newAnim = { ...animationIn, duration: val };
                                setAnimationIn(newAnim);
                                update_value({ animation: { in: newAnim, out: animationOut } });
                            }}
                        />
                        <div className="theme-small-text">{(animationIn.duration / 30).toFixed(2)}s</div>
                        {["Slide Left", "Slide Right", "Slide Top", "Slide Bottom"].includes(animationTypeIn) &&
                            renderSlideControl(animationTypeIn as keyof typeof slideConfigs, "in")}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {renderAnimationButton("Slide Left", "Slide", <LuArrowLeft />, "in")}
                        {renderAnimationButton("Slide Right", "Slide", <LuArrowRight />, "in")}
                        {renderAnimationButton("Slide Top", "Slide", <LuArrowUp />, "in")}
                        {renderAnimationButton("Slide Bottom", "Slide", <LuArrowDown />, "in")}
                        {renderAnimationButton("Fade in", "Fade", undefined, "in")}
                        {renderAnimationButton("Zoom in", "Zoom", undefined, "in")}
                        {/* {renderAnimationButton("Zoom out", "Zoom", undefined, "in")} */}
                    </div>
                </>
            )}

            {InOutactiveTab === "out" && (
                <>
                    <div className="mb-4 space-y-2">
                        <label className="theme-small-text w-8/12">Out Duration (ms)</label>
                        <input
                            className="kd-range-input"
                            type="range"
                            min={1}
                            max={300}
                            step={1}
                            value={animationOut.duration}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const newAnim = { ...animationOut, duration: val };
                                setAnimationOut(newAnim);
                                update_value({ animation: { in: animationIn, out: newAnim } });
                            }}
                        />
                        <div className="theme-small-text">{(animationOut.duration / 30).toFixed(2)}s</div>
                        {["Slide Left", "Slide Right", "Slide Top", "Slide Bottom"].includes(animationTypeOut) &&
                            renderSlideControl(animationTypeOut as keyof typeof slideConfigs, "out")}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {renderAnimationButton("Slide Left", "Slide", <LuArrowLeft />, "out")}
                        {renderAnimationButton("Slide Right", "Slide", <LuArrowRight />, "out")}
                        {renderAnimationButton("Slide Top", "Slide", <LuArrowUp />, "out")}
                        {renderAnimationButton("Slide Bottom", "Slide", <LuArrowDown />, "out")}
                        {renderAnimationButton("Fade out", "Fade", undefined, "out")}
                        {/* {renderAnimationButton("Zoom in", "Zoom", undefined, "out")} */}
                        {renderAnimationButton("Zoom out", "Zoom", undefined, "out")}
                    </div>
                </>
            )}
        </>
    );
};

export default AnimationHelper;
