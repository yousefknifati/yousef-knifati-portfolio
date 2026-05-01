type Props = {
  text: string;
  status?: boolean;
  className?: string;
};
const StatusSpan = ({ status, text, className }: Props) => {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-3 py-1 font-medium  text-sm ${
        status ? "bg-success-light text-success-dark"
          : "bg-warning-light  text-warning-dark" 
      } ${className} `}
    >
      {text}
    </span>
  );
};

export default StatusSpan;
