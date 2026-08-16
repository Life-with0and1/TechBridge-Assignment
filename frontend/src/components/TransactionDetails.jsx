function TransactionDetails({ transaction, onClose }) {
  if (!transaction) {
    return null;
  }

  return (
    <div className="transaction-details">
      <h2>Transaction Details</h2>

      <div>
        <strong>Date</strong>
        <p>
          {new Date(
            transaction.transaction_date
          ).toLocaleDateString()}
        </p>
      </div>

      <div>
        <strong>Category</strong>
        <p>{transaction.category}</p>
      </div>

      <div>
        <strong>Type</strong>
        <p>{transaction.type}</p>
      </div>

      <div>
        <strong>Amount</strong>
        <p>
          ₹{Number(transaction.amount).toFixed(2)}
        </p>
      </div>

      <div>
        <strong>Description</strong>
        <p>
          {transaction.description || "-"}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

export default TransactionDetails;