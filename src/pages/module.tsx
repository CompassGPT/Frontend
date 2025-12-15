import { useParams } from "react-router";

export function ModulePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1>Module {id}</h1>
    </div>
  );
}
