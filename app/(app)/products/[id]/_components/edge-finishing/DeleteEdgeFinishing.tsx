import { DeleteAlertDialog } from "@/components/DeleteAlert";
import { useDeleteEdgeFinishing } from "@/hooks/api";

export function DeleteEdgeFinishing({ id, productId }: { id: string; productId: string }) {
  const deleteEdgeFinishingMutation = useDeleteEdgeFinishing();

  const onConfirmDelete = async () => {
    try {
      await deleteEdgeFinishingMutation.mutateAsync({ id, productId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DeleteAlertDialog
      onConfirm={onConfirmDelete}
      title="Delete Edge Finishing"
      description="Are you sure you want to delete this edge finishing?"
      isLoading={deleteEdgeFinishingMutation.isPending}
    />
  );
}
