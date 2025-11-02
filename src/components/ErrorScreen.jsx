import icon_error from "../assets/images/icon-error.svg";
import icon_retry from "../assets/images/icon-retry.svg";
import icon_loading from "../assets/images/icon-loading.svg";
import './error-screen.css';

export default function ErrorScreen({ message, onRetry, isLoading }) {
  return (
    <div className="error-screen">
      <div className="error-icon"><img src={icon_error} alt="Error Loading"></img></div>
      <h2>Something went wrong</h2>
      <p>
        We couldn’t connect to the server ({message}).<br />
        Please try again in a few moments.
      </p>
      <button onClick={onRetry} className="retry-btn" disabled={isLoading}>
        {isLoading?(
            <img
            src={icon_loading}
            alt="Reloading..."
            className="reload-icon spinning"
          />
        ):(
            <><img src={icon_retry} alt="" /> <span>Retry</span></>
        )}
        
      </button>
    </div>
  );
}
