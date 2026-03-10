"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import VisitService from "@/services/apidefinitions/visitService";
import {
  User,
  Clock,
  Users,
  ClipboardList,
  Laptop,
  FileSignature,
  LogOut,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

export function VisitorDetailSheet({ visitor, isOpen, onOpenChange }: any) {
  // 1. DEFINING THE MISSING VARIABLES
  const [fullData, setFullData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && visitor?.id) {
      const fetchFullDetails = async () => {
        setLoading(true);
        try {
          const response = await VisitService.getVisitById(visitor.id);

          setFullData(response.data);
        } catch (err) {
          console.error("Error loading full visit details", err);
        } finally {
          setLoading(false);
        }
      };
      fetchFullDetails();
    } else if (!isOpen) {
      setFullData(null);
    }
  }, [isOpen, visitor?.id]);

  if (!visitor) return null;

  const display = fullData || visitor;

  const formatSignature = (sig: string | null | undefined) => {
    if (!sig) return undefined;
    return sig.startsWith("data:image") ? sig : `data:image/png;base64,${sig}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px] bg-white p-0 border-l shadow-2xl overflow-y-auto">
        <SheetHeader className="p-8 border-b flex flex-row items-center gap-3">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <User className="text-slate-400" size={22} />
          </div>
          <SheetTitle className="text-xl font-bold text-[#1D2E5A] flex items-center gap-2">
            Visitor Details
            {loading && (
              <Loader2 className="animate-spin text-blue-500" size={16} />
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col py-10 px-8 gap-10">
          <DetailRow
            icon={<User size={20} className="text-blue-500" />}
            label="Visitor's Name"
            value={display.visitorName || display.name}
            bgColor="bg-blue-50"
          />

          <DetailRow
            icon={<Clock size={20} className="text-yellow-500" />}
            label="Entry Time"
            value={
              display.signInTime
                ? new Date(display.signInTime).toLocaleTimeString()
                : "N/A"
            }
            bgColor="bg-yellow-50"
          />

          <DetailRow
            icon={<Users size={20} className="text-purple-500" />}
            label="Host/Personnel"
            value={`${display.hostName || "N/A"} • ${display.department || "N/A"}`}
            bgColor="bg-purple-50"
          />

          <DetailRow
            icon={<ClipboardList size={20} className="text-pink-500" />}
            label="Visitor's Purpose"
            value={display.purpose || "N/A"}
            bgColor="bg-pink-50"
          />

          <DetailRow
            icon={<Laptop size={20} className="text-orange-500" />}
            label="Laptop"
            value={display.laptopModel || "None"}
            bgColor="bg-orange-50"
          />

          {/* Sign In Signature Section */}
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-xl bg-indigo-50 shrink-0 text-indigo-500">
              <FileSignature size={20} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Sign In Signature
              </p>
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 mt-1 min-h-[100px] flex items-center justify-center">
                {loading ? (
                  <Loader2 className="animate-spin text-slate-300" />
                ) : display.signInSignature ? (
                  <img
                    src={formatSignature(display.signInSignature)}
                    alt="Sign-in Signature"
                    className="max-h-20 w-auto object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No signature recorded
                  </span>
                )}
              </div>
            </div>
          </div>

          <DetailRow
            icon={<Clock size={20} className="text-green-500" />}
            label="Exit Time"
            value={
              display.signOutTime
                ? new Date(display.signOutTime).toLocaleTimeString()
                : "N/A"
            }
            bgColor="bg-green-50"
            valueColor={
              display.signOutTime ? "text-slate-800" : "text-green-600"
            }
          />
          {/* Sign Out Signature Section */}
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-xl bg-cyan-50 shrink-0 text-cyan-500">
              <LogOut size={20} />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Sign Out Signature
              </p>

              {/* This container ensures the box always renders, even if the image is missing */}
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 mt-1 min-h-[100px] flex items-center justify-center relative">
                {loading ? (
                  <Loader2 className="animate-spin text-slate-300" />
                ) : display.signOutSignature ? (
                  <img
                    src={formatSignature(display.signOutSignature)}
                    alt="Sign-out Signature"
                    className="max-h-20 w-auto object-contain transition-all hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-400 italic">
                      {display.status === "SIGNED_IN"
                        ? "Visitor still on-site"
                        : "No signature recorded"}
                    </span>
                    {display.status === "SIGNED_IN" && (
                      <span className="text-[10px] text-blue-400 font-medium">
                        Pending checkout
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// 3. THE HELPER FUNCTION (Ensure this is OUTSIDE the main component)
function DetailRow({
  icon,
  label,
  value,
  bgColor,
  valueColor = "text-slate-800",
}: any) {
  return (
    <div className="flex items-start gap-5">
      <div className={`p-3 rounded-xl ${bgColor} shrink-0`}>{icon}</div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className={`text-base font-bold ${valueColor} tracking-tight`}>
          {value}
        </p>
      </div>
    </div>
  );
}
