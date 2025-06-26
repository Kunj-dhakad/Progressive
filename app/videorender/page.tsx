// "use client";

// import type { NextPage } from "next";
// import React, { useMemo, useEffect} from "react";
// import { CompositionProps } from "../../types/constants";
// import { z } from "zod";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store/store";
// import {  setsaveDraftId, setSaveDraftname } from "../store/editorSetting";
// import { RenderControls } from "../../components/render_control/RenderControls";
// import { useTemplateSet } from "../../components/editor/tool/template_set_fun";


// const Home: NextPage = () => {
//     const dispatch = useDispatch();
//     const Allclips = useSelector(
//         (state: RootState) => state.slices.present.Allclips
//     );
//     const DURATION_IN_FRAMES = useSelector(
//         (state: RootState) => state.slices.present.totalduration
//     );
//     const VIDEO_HEIGHT = useSelector(
//         (state: RootState) => state.slices.present.videoheight
//     );
//     const VIDEO_WIDTH = useSelector(
//         (state: RootState) => state.slices.present.videowidth
//     );
//     const VIDEO_BG = useSelector(
//         (state: RootState) => state.slices.present.videobg
//     );

//     const Watermark = useSelector(
//         (state: RootState) => state.slices.present.Watermark
//     );


//     const Set_template = useTemplateSet();
//     useEffect(() => {
//         const handleMessage = (event: MessageEvent) => {

//             if (event.data.action === 'temlateOpenInEditor') {
//                 console.log("temlateOpenInEditor", event.data);
//                 Set_template(event.data.template_url)
//                 dispatch(setSaveDraftname(event.data.project_name));
//                 dispatch(setsaveDraftId(event.data.id));
//             }
//         };
//         window.addEventListener('message', handleMessage);
//         return () => {
//             window.removeEventListener('message', handleMessage);
//         };

//     }, [Set_template]);



//     const inputProps: z.infer<typeof CompositionProps> = useMemo(
//         () => ({
//             durationInFrames: DURATION_IN_FRAMES,
//             videoWidth: VIDEO_WIDTH,
//             videoHeight: VIDEO_HEIGHT,
//             videobg: VIDEO_BG,
//             Allclips,
//             Watermark,
//         }),
//         [DURATION_IN_FRAMES, Allclips, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_BG, Watermark]
//     );

//     return (
//         <>

//             <div className="main-wrapper flex" 
//                >
//                 <div> <RenderControls inputProps={inputProps}></RenderControls> </div>
//             </div>
//         </>
//     );
// };

// export default Home;

"use client";

import type { NextPage } from "next";
import React, {
    useMemo,
    //  useEffect, 
    useCallback
} from "react";
import { z } from "zod";
import {
    useSelector,
    //  useDispatch
} from "react-redux";
import { RootState } from "../store/store";
// import { setsaveDraftId, setSaveDraftname } from "../store/editorSetting";
import { useTemplateSet } from "../../components/editor/tool/template_set_fun";
import { useRendering } from "../../helpers/use-rendering";

import { CompositionProps, COMP_NAME } from "../../types/constants";



const videosData = [
    {
        id: "video1",
        project_name: "Promo Video",
        video_url: "https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/templates/Digital_Agency.mp4",
        template_url: "https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/templates/cretive.json",
    },
    {
        id: "video2",
        project_name: "Ad Campaign",
        video_url: "https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/templates/14m9p3pyis.mp4",
        template_url: "https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/templates/cretive.json",
    },
];

const Home: NextPage = () => {
    // const dispatch = useDispatch();
    const Allclips = useSelector((state: RootState) => state.slices.present.Allclips);
    const DURATION_IN_FRAMES = useSelector((state: RootState) => state.slices.present.totalduration);
    const VIDEO_HEIGHT = useSelector((state: RootState) => state.slices.present.videoheight);
    const VIDEO_WIDTH = useSelector((state: RootState) => state.slices.present.videowidth);
    const VIDEO_BG = useSelector((state: RootState) => state.slices.present.videobg);
    const Watermark = useSelector((state: RootState) => state.slices.present.Watermark);

    const Set_template = useTemplateSet();

    const inputProps: z.infer<typeof CompositionProps> = useMemo(() => ({
        durationInFrames: DURATION_IN_FRAMES,
        videoWidth: VIDEO_WIDTH,
        videoHeight: VIDEO_HEIGHT,
        videobg: VIDEO_BG,
        Allclips,
        Watermark,
    }), [DURATION_IN_FRAMES, Allclips, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_BG, Watermark]);

    const { renderMedia, state } = useRendering(COMP_NAME, inputProps);


    const handleEdit = useCallback((video: any) => {
        // console.log("Editing video:", video.template_url);
        Set_template(video.template_url);
    }, []);

    const handleRender = useCallback((video: any) => {
        // console.log("Rendering video:", video.template_url);
        Set_template(video.template_url);
        setTimeout(() => {
            renderMedia();
        }, 100);
    }, [renderMedia, Set_template]);

    return (
        <div className="main-wrapper p-6 space-y-8">
            {/* <RenderControls inputProps={inputProps} /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videosData.map((video) => (
                    <div key={video.id} className="border rounded-xl p-4 shadow bg-white">
                        <video
                            className="w-full rounded-md h-60"
                            src={video.video_url}
                            controls
                            poster="/poster.jpg"
                        />
                        <div className="flex justify-between mt-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => handleEdit(video)}
                            >
                                Edit Video
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={() => handleRender(video)}
                            >
                                {state.status === "rendering" ? "Rendering..." : "Render Video"}
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
