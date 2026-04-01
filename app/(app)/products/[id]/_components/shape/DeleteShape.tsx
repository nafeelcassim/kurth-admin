import { DeleteAlertDialog } from "@/components/DeleteAlert";
import { useDeleteShape } from "@/hooks/api";

export function DeleteShape({ id }: { id: string }) {
  const deleteShapeMutation = useDeleteShape();

  const onConfirmDelete = async () => {
    try {
      await deleteShapeMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DeleteAlertDialog
      onConfirm={onConfirmDelete}
      title="Delete Shape"
      description="Are you sure you want to delete this shape?"
      isLoading={deleteShapeMutation.isPending}
    />
  );
}
