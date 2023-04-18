/**
 * @description:ILabel
 */
export interface ICmd {
  id: number;
  name: string;
  keyValue: string;
}
export const cmdModel: ICmd = reactive({
  id: 0,
  name: '',
  keyValue: ''
});

export const ClearCmdModel = () => {
  cmdModel.id = 0;
  cmdModel.name = '';
  cmdModel.keyValue = '';
};
