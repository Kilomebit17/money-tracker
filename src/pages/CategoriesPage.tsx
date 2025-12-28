import type { FormEvent } from "react";
import { useState } from "react";
import { useFinance } from "../providers/FinanceProvider";
import CategoryManager from "../components/CategoryManager";
import type { Category } from "../types/finance";

type CategoryFormField = "name" | "color" | "icon";

const CategoriesPage = () => {
  const { categories, setCategories } = useFinance();
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: "",
    color: "#7c3aed",
    icon: "🏷️",
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryDraft, setEditingCategoryDraft] = useState({
    name: "",
    color: "#7c3aed",
    icon: "🏷️",
  });

  const handleCategorySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newCategoryForm.name.trim()) {
      return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryForm.name.trim(),
      color: newCategoryForm.color,
      icon: newCategoryForm.icon || "🏷️",
    };

    setCategories((prev) => [newCategory, ...prev]);
    setNewCategoryForm({ name: "", color: "#7c3aed", icon: "🏷️" });
  };

  const startCategoryEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryDraft({
      name: category.name,
      color: category.color,
      icon: category.icon,
    });
  };

  const handleCategorySave = () => {
    if (!editingCategoryId) {
      return;
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === editingCategoryId
          ? {
              ...category,
              name: editingCategoryDraft.name,
              color: editingCategoryDraft.color,
              icon: editingCategoryDraft.icon,
            }
          : category
      )
    );

    setEditingCategoryId(null);
  };

  const handleCategoryDelete = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const handleNewCategoryFieldUpdate = (
    field: CategoryFormField,
    value: string
  ) => {
    setNewCategoryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditFieldUpdate = (field: CategoryFormField, value: string) => {
    setEditingCategoryDraft((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <CategoryManager
      categories={categories}
      newCategoryForm={newCategoryForm}
      editingCategoryId={editingCategoryId}
      editingCategoryDraft={editingCategoryDraft}
      onNewCategoryFieldUpdate={handleNewCategoryFieldUpdate}
      onNewCategorySubmit={handleCategorySubmit}
      onStartEdit={startCategoryEdit}
      onEditFieldUpdate={handleEditFieldUpdate}
      onSaveEdit={handleCategorySave}
      onCancelEdit={() => setEditingCategoryId(null)}
      onDelete={handleCategoryDelete}
    />
  );
};

export default CategoriesPage;

