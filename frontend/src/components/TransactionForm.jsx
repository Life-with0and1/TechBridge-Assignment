import { useCallback, useEffect, useState } from "react";
import {
  createTransaction,
  updateTransaction,
} from "../services/transactionService";

const initialForm = {
  category_id: "",
  type: "expense",
  amount: "",
  description: "",
  transaction_date: "",
};

function TransactionForm({
  categories,
  transaction = null,
  readOnly = false,
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(transaction);

  useEffect(() => {
    if (transaction) {
      setFormData({
        category_id: transaction.category_id || "",
        type: transaction.type || "expense",
        amount: transaction.amount || "",
        description: transaction.description || "",
        transaction_date: transaction.transaction_date
          ? transaction.transaction_date.split("T")[0]
          : "",
      });
    } else {
      setFormData(initialForm);
    }

    setError("");
  }, [transaction]);

  const handleChange = useCallback(
    (event) => {
      if (readOnly) {
        return;
      }

      const { name, value } = event.target;

      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));
    },
    [readOnly]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (readOnly) {
      return;
    }

    setError("");

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!formData.transaction_date) {
      setError("Please select a transaction date.");
      return;
    }

    try {
      setLoading(true);

      const data = {
        category_id: Number(formData.category_id),
        type: formData.type,
        amount: Number(formData.amount),
        description: formData.description.trim(),
        transaction_date: formData.transaction_date,
      };

      if (isEditing) {
        await updateTransaction(transaction.id, data);
      } else {
        await createTransaction(data);
      }

      setFormData(initialForm);

      onSuccess();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h2>
        {readOnly
          ? "View Transaction"
          : isEditing
            ? "Edit Transaction"
            : "Add Transaction"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Type */}
        <div>
          <label htmlFor="type">
            Type
          </label>

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={readOnly || loading}
          >
            <option value="expense">
              Expense
            </option>

            <option value="income">
              Income
            </option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category_id">
            Category
          </label>

          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            disabled={readOnly || loading}
            required
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount">
            Amount
          </label>

          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            disabled={readOnly || loading}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">
            Description
          </label>

          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            disabled={readOnly || loading}
            placeholder="Optional description"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="transaction_date">
            Transaction Date
          </label>

          <input
            id="transaction_date"
            name="transaction_date"
            type="date"
            value={formData.transaction_date}
            onChange={handleChange}
            disabled={readOnly || loading}
            required
          />
        </div>

        {/* Error */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Buttons */}
        {!readOnly && (
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Transaction"
                : "Add Transaction"}
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          {readOnly ? "Close" : "Cancel"}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;