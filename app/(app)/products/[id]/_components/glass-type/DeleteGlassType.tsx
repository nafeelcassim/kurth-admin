import { DeleteAlertDialog } from "@/components/DeleteAlert";
import { useDeleteGlassType } from "@/hooks/api";

export function DeleteGlassType({ id, productId }: { id: string; productId: string }) {
  const deleteGlassTypeMutation = useDeleteGlassType();

  const onConfirmDelete = async () => {
    try {
      await deleteGlassTypeMutation.mutateAsync({ id, productId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DeleteAlertDialog
      onConfirm={onConfirmDelete}
      title="Delete Glass Type"
      description="Are you sure you want to delete this glass type?"
      isLoading={deleteGlassTypeMutation.isPending}
    />
  );
}
