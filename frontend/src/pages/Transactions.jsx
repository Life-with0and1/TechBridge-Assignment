import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTransactions,
  getTransactionById,
  deleteTransaction,
} from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import TransactionForm from "../components/TransactionForm";
import TransactionDetails from "../components/TransactionDetails";

function Transactions() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [viewingTransaction, setViewingTransaction] =useState(null);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTransactions({
        page,
        limit,
        search,
        category_id: categoryId,
        type,
      });

      setTransactions(response.transactions || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId, type]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();

      setCategories(response.categories || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (result, transaction) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
          result.income += amount;
        } else {
          result.expense += amount;
        }

        return result;
      },
      {
        income: 0,
        expense: 0,
      }
    );
  }, [transactions]);

  const balance = totals.income - totals.expense;

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((event) => {
    setCategoryId(event.target.value);
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((event) => {
    setType(event.target.value);
    setPage(1);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingTransaction(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback(async (id) => {
    try {
      setError("");

      const response = await getTransactionById(id);

      setEditingTransaction(response.transaction);
      setShowForm(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load transaction."
      );
    }
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
      );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await deleteTransaction(id);

        await loadTransactions();
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to delete transaction."
        );
      }
    },
    [loadTransactions]
  );

  const handleFormSuccess = useCallback(async () => {
    setShowForm(false);
    setEditingTransaction(null);

    await loadTransactions();
  }, [loadTransactions]);

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    setEditingTransaction(null);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (transactions.length === limit) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [transactions.length]);

  const handleView = useCallback(async (id) => {
  try {
    setError("");

    const response = await getTransactionById(id);

    setViewingTransaction(response.transaction);
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to load transaction."
    );
  }
}, []);
const handleCloseDetails = useCallback(() => {
  setViewingTransaction(null);
}, []);

  const isReadOnly = user?.role === "read-only";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            Manage and view your income and expenses.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={handleAdd}
          >
            Add Transaction
          </button>
        )}
      </div>

      <div className="summary-grid">
        <div>
          <h3>Income</h3>
          <p>
            ₹{totals.income.toFixed(2)}
          </p>
        </div>

        <div>
          <h3>Expenses</h3>
          <p>
            ₹{totals.expense.toFixed(2)}
          </p>
        </div>

        <div>
          <h3>Balance</h3>
          <p>
            ₹{balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search transactions..."
          value={search}
          onChange={handleSearchChange}
        />

        <select
          value={categoryId}
          onChange={handleCategoryChange}
        >
          <option value="">
            All categories
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

        <select
          value={type}
          onChange={handleTypeChange}
        >
          <option value="">
            All types
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {showForm && !isReadOnly && (
        <TransactionForm
          categories={categories}
          transaction={editingTransaction}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="transaction-table">
          {viewingTransaction && (
            <TransactionDetails
              transaction={viewingTransaction}
              onClose={handleCloseDetails}
            />
          )}
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    {new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {transaction.category}
                  </td>

                  <td>
                    {transaction.type}
                  </td>

                  <td>
                    {transaction.description || "-"}
                  </td>

                  <td>
                    ₹
                    {Number(
                      transaction.amount
                    ).toFixed(2)}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        handleView(transaction.id)
                      }
                    >
                      View
                    </button>

                    {!isReadOnly && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              transaction.id
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              transaction.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={
                page === 1 || loading
              }
            >
              Previous
            </button>

            <span>
              Page {page}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={
                transactions.length < limit ||
                loading
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;