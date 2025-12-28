import type { FormEvent } from "react";
import type { Category } from "../types/finance";

type CategoryField = "name" | "color" | "icon";

interface CategoryManagerProps {
  categories: Category[];
  newCategoryForm: {
    name: string;
    color: string;
    icon: string;
  };
  editingCategoryId: string | null;
  editingCategoryDraft: {
    name: string;
    color: string;
    icon: string;
  };
  onNewCategoryFieldUpdate: (field: CategoryField, value: string) => void;
  onNewCategorySubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: (category: Category) => void;
  onEditFieldUpdate: (field: CategoryField, value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}

const CategoryManager = ({
  categories,
  newCategoryForm,
  editingCategoryId,
  editingCategoryDraft,
  onNewCategoryFieldUpdate,
  onNewCategorySubmit,
  onStartEdit,
  onEditFieldUpdate,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: CategoryManagerProps) => (
  <>
    <article className="glass-card category-form">
      <header>
        <h2>Add a category</h2>
      </header>
      <form onSubmit={onNewCategorySubmit}>
        <label>
          Name
          <input
            type="text"
            placeholder="Health, Travel, Gifts..."
            value={newCategoryForm.name}
            onChange={(event) =>
              onNewCategoryFieldUpdate("name", event.target.value)
            }
          />
        </label>
        <label>
          Icon
          <input
            type="text"
            maxLength={2}
            placeholder="🏖️"
            value={newCategoryForm.icon}
            onChange={(event) =>
              onNewCategoryFieldUpdate("icon", event.target.value)
            }
          />
        </label>
        <label>
          Color
          <input
            type="color"
            value={newCategoryForm.color}
            onChange={(event) =>
              onNewCategoryFieldUpdate("color", event.target.value)
            }
          />
        </label>
        <button type="submit">Save category</button>
      </form>
    </article>

    <article className="glass-card category-list">
      <header>
        <h2>Manage categories</h2>
      </header>
      <ul>
        {categories.map((category) => {
          const isEditing = editingCategoryId === category.id;

          return (
            <li key={category.id}>
              <div
                className="category-list__swatch"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              {isEditing ? (
                <>
                  <input
                    value={editingCategoryDraft.name}
                    onChange={(event) =>
                      onEditFieldUpdate("name", event.target.value)
                    }
                  />
                  <input
                    value={editingCategoryDraft.icon}
                    onChange={(event) =>
                      onEditFieldUpdate("icon", event.target.value)
                    }
                  />
                  <input
                    type="color"
                    value={editingCategoryDraft.color}
                    onChange={(event) =>
                      onEditFieldUpdate("color", event.target.value)
                    }
                  />
                  <button type="button" onClick={onSaveEdit}>
                    Save
                  </button>
                  <button type="button" onClick={onCancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{category.name}</strong>
                  <div className="category-list__actions">
                    <button type="button" onClick={() => onStartEdit(category)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete(category.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  </>
);

export default CategoryManager;
