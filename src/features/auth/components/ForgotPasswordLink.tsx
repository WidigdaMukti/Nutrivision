interface ForgotPasswordLinkProps {
  isLoading: boolean;
}

export const ForgotPasswordLink = ({ isLoading }: ForgotPasswordLinkProps) => (
  <div className="text-left">
    <button 
      className="text-teal-500 text-base font-medium hover:text-teal-600 disabled:opacity-50"
      disabled={isLoading}
    >
      Lupa Katasandi?
    </button>
  </div>
);