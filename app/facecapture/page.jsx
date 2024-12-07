import WebcamCapture from "@/components/WebcamCapture";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return <WebcamCapture />;
}
