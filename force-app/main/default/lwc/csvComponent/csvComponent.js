import { LightningElement,wire } from 'lwc';
import fetchRecords from '@salesforce/apex/CsvController.fetchRecords';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' }
 ];
export default class CsvComponent extends LightningElement {
    accountData =[];
    columns = COLUMNS;


    @wire(fetchRecords)
    wiredFunction({data, error}){
        if (data) {
            this.accountData = data;
        }else if(error){
            console.log(error);
        }
    }

    get checkRecord(){
        return this.accountData.length > 0 ? false : true;
    }

    clickHandler(){
        let selectedRows = [];
        let downloadRecords = [];
        selectedRows = this.template.querySelector(
            'lightning-datatable'
        ).getSelectedRows();
        if(selectedRows.length > 0){
            downloadRecords = [...selectedRows];
        }else{
            downloadRecords = [...this.accountData];
        }

        let csvFile = this.convertArrayToCSV(downloadRecords);
        this.createLinkForDownload(csvFile);
    }

    convertArrayToCSV(downloadRecords){
        let csvHeader = Object.keys(downloadRecords[0]).toString();
        let csvBody = downloadRecords.map((item) => {
            return Object.values(item).toString();
        });

        let csvFile = csvHeader + '\n' + csvBody.join('\n');
        return csvFile;
    }

    createLinkForDownload(csvFile){
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);

        downloadLink.target = '_blank';
        downloadLink.download = 'Accounts_Data.csv';
        downloadLink.click();
    }
    

}