import { DeleteAlertDialog } from "@/components/DeleteAlert";
import { useDeleteThickness } from "@/hooks/api";

export function DeleteThickness({ id }: { id: string }) {
  const deleteThicknessMutation = useDeleteThickness();

  const onConfirmDelete = async () => {
    try {
      await deleteThicknessMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DeleteAlertDialog
      onConfirm={onConfirmDelete}
      title="Delete Thickness"
      description="Are you sure you want to delete this thickness?"
      isLoading={deleteThicknessMutation.isPending}
    />
  );
}
