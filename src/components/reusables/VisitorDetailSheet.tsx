import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  User,
  Clock,
  Users,
  ClipboardList,
  Laptop,
  FileSignature,
  LogOut,
} from "lucide-react";

export function VisitorDetailSheet({ visitor, isOpen, onOpenChange }: any) {
  if (!visitor) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[420px] bg-white p-0 border-l shadow-2xl">
        <SheetHeader className="p-6 border-b flex flex-row items-center gap-2">
          <div className="bg-slate-50 p-2 rounded-lg">
            <User className="text-slate-400" size={20} />
          </div>
          <SheetTitle className="text-lg font-bold text-[#1D2E5A]">
            Visitor
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col p-6 gap-8">
          {/* Visitor Name */}
          <DetailRow
            icon={<User size={18} className="text-blue-400" />}
            label="Visitor's Name"
            value={visitor.name}
            bgColor="bg-blue-50"
          />

          {/* Entry Time */}
          <DetailRow
            icon={<Clock size={18} className="text-yellow-500" />}
            label="Entry Time"
            value={visitor.entryTime}
            bgColor="bg-yellow-50"
          />

          {/* Host/Personnel */}
          <DetailRow
            icon={<Users size={18} className="text-purple-400" />}
            label="Host/Personnel"
            value={`${visitor.whoToSee} . ${visitor.department || "IT"}`}
            bgColor="bg-purple-50"
          />

          {/* Purpose */}
          <DetailRow
            icon={<ClipboardList size={18} className="text-pink-400" />}
            label="Visitor's Purpose"
            value={visitor.purpose}
            bgColor="bg-pink-50"
          />

          {/* Laptop */}
          <DetailRow
            icon={<Laptop size={18} className="text-orange-400" />}
            label="Laptop"
            value={visitor.laptopModel || "None"}
            bgColor="bg-orange-50"
          />

          {/* Sign In Signature */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-50 shrink-0 text-blue-400">
              <FileSignature size={18} />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                Sign In Signature
              </p>
              <div className="border border-slate-100 rounded-lg p-2 bg-slate-50/50 mt-1">
                <img
                  src={visitor.signature}
                  alt="Sign-in"
                  className="h-12 object-contain grayscale"
                />
              </div>
            </div>
          </div>

          {/* Exit Time with "Still Around" Badge */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-green-50 shrink-0 text-green-500">
              <Clock size={18} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                Exit Time
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-slate-700">
                  {visitor.exitTime || "Still Around"}
                </span>
                {!visitor.exitTime && (
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Sign Out Signature Placeholder */}
          <DetailRow
            icon={<LogOut size={18} className="text-cyan-400" />}
            label="Sign Out Signature"
            value="—"
            bgColor="bg-cyan-50"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ icon, label, value, bgColor }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={`p-2.5 rounded-xl ${bgColor} shrink-0`}>{icon}</div>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
