export default function removeRepitedObjects(array: any) {
  return array.filter((objeto: any, indice: number, self: any[]) => {
    return (
      self.findIndex((o) => JSON.stringify(o) === JSON.stringify(objeto)) ===
      indice
    );
  });
}
