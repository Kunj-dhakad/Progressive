require('dotenv').config();

import { renderStillOnLambda, speculateFunctionName } from "@remotion/lambda/client";
import { AwsRegion, RenderStillOnLambdaOutput } from "@remotion/lambda/client";
import { NextResponse } from "next/server";
import { REGION, DISK, RAM, TIMEOUT, SITE_NAME } from "../../../config.mjs";

export async function POST(request: Request) {
  try {
    const { compositionId, frame, inputProps,imageFormat  } = await request.json();


    const result: RenderStillOnLambdaOutput = await renderStillOnLambda({
        functionName: speculateFunctionName({
            diskSizeInMb: DISK,
            memorySizeInMb: RAM,
            timeoutInSeconds: TIMEOUT,
        }),
        region: REGION as AwsRegion,
        serveUrl: SITE_NAME,
        composition: compositionId,
        frame: Number(frame),
        inputProps,
        downloadBehavior: {
            type: "download",
            fileName: `image.${imageFormat || 'png'}`,
        },
        imageFormat,
        privacy: "public"
    });

    return NextResponse.json({ imageUrl: result.url });
  } catch (err) {
    console.error("Screenshot render error:", err);
    return NextResponse.json({ error: "Screenshot rendering failed" }, { status: 500 });
  }
}
