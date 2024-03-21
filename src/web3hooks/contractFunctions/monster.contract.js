export const getAllMonsters = async (contract) => {
  const res = await contract.methods.getAllMonsters().call();
  console.log(res)
  return res;
};
