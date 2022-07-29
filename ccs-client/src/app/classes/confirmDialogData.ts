export class ConfirmDialogData {
  constructor(
    public header1: string,
    public text1: string,
    public buttonDeny: string,
    public buttonConfirm: string,
    public header2: string = "",
    public text2: string = ""
  ) {}
}
