import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FileX, Search, AlertCircle, Inbox, Lock, Wrench } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

type EmptyStateVariant =
  | "default"
  | "search"
  | "error"
  | "no-data"
  | "loading-error"
  | "permission-denied"
  | "maintenance";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  illustration?: ReactNode;
  className?: string;
}

const variantConfig = {
  default: {
    icon: Inbox,
    title: "Veri bulunamadı",
    description: "Henüz görüntülenecek veri yok.",
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  search: {
    icon: Search,
    title: "Sonuç bulunamadı",
    description: "Arama kriterlerinize uygun sonuç bulunamadı.",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  error: {
    icon: AlertCircle,
    title: "Bir hata oluştu",
    description: "Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.",
    iconColor: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  "no-data": {
    icon: FileX,
    title: "Kayıt yok",
    description: "Bu kategoride henüz kayıt bulunmamaktadır.",
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  "loading-error": {
    icon: AlertCircle,
    title: "Yükleme hatası",
    description:
      "Veriler yüklenirken bir sorun oluştu. Bağlantınızı kontrol edip tekrar deneyin.",
    iconColor: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  "permission-denied": {
    icon: Lock,
    title: "Erişim reddedildi",
    description: "Bu içeriği görüntülemek için gerekli izniniz yok.",
    iconColor: "text-warning",
    bgColor: "bg-warning/10",
  },
  maintenance: {
    icon: Wrench,
    title: "Bakım modu",
    description:
      "Bu özellik şu anda bakım modunda. Lütfen daha sonra tekrar deneyin.",
    iconColor: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
};

export function EmptyState({
  variant = "default",
  title,
  description,
  action,
  illustration,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Empty className={cn("border-0", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {illustration ? (
            <div className="h-12 w-12 animate-bounce-subtle">
              {illustration}
            </div>
          ) : (
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                config.bgColor,
                "animate-bounce-subtle",
              )}
            >
              <Icon className={cn("h-6 w-6", config.iconColor)} />
            </div>
          )}
        </EmptyMedia>
        <EmptyTitle className="text-base">{title || config.title}</EmptyTitle>
        <EmptyDescription>{description || config.description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
