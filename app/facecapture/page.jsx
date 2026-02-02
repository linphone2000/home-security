import WebcamCapture from "@/components/WebcamCapture";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <WebcamCapture />;
    </>
  );
}
