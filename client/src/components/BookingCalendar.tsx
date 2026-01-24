import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function BookingCalendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: {
          branding: {
            brandColor: "#A05E44", // Your 'terracotta' color
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="w-full h-[600px] overflow-scroll bg-white rounded-lg border border-gray-100 shadow-sm mt-8">
      <Cal
        calLink="omflorwellness" // REPLACE with her actual Cal.com username
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
