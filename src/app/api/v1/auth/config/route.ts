import { env } from "@/lib/server/config/env";
import { handleRoute, successResponse } from "@/lib/server/http";
import { isGoogleSignInEnabled } from "@/lib/server/services/auth.service";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () =>
    successResponse("Auth configuration fetched successfully", {
      googleClientId: env.GOOGLE_CLIENT_ID,
      googleSignInEnabled: isGoogleSignInEnabled(),
    })
  );
}
