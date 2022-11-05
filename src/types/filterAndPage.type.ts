export interface IFilterAndPageState {
  currentPage: Number;
  pageSize: Number;
  warriorFilterLevel: Number;
  beastFilterCapacity: Number;
  warriorFilterMinAP: Number;
  warriorFilterMaxAP: Number;
  warriorFilterMinConstAP: Number;
  warriorFilterMaxConstAP: Number;
  legionFilterMinAP: Number;
  legionFilterMaxAP: Number;
  legionFilterMinConstAP: Number;
  legionFilterMaxConstAP: Number;

  sortAP: Number;
  sortPrice: Number;
  sortAPandPrice: Number;
  showOnlyNew: boolean;
  showOnlyMine: boolean;
  hideWeakLegion: boolean;
  legionFilterHuntStatus: Number;
  legionFilterMinSupplies: Number;
  legionFilterMaxSupplies: Number;
  legionFilterMinConstSupplies: Number;
  legionFilterMaxConstSupplies: Number;
}
