import { FetchServices } from './FetchServices';
import EventEmitter from "eventemitter3";
import deepGet from "lodash/get";

class Pagination {
   
    /**
     * 
     * @param {*} fetchUrl 
     * @param {*} callbacks 
     * @param {*} fetchServices 
     * @param {*} params 
     * NOTE params were added later m ideally it should be second parameter to the constructor
     *  but can risk it now to change the signature everywhere
     */
    constructor(fetchUrl,  callbacks ,  fetchServices , params) {
      this.fetchUrl = fetchUrl ; 
      this.callbacks =  callbacks || {};
      this.refreshing =  false ; 
      this.loadingNext =  false ; 

      this.event = new EventEmitter();
      this.fetchServices = fetchServices || new FetchServices(this.fetchUrl , params); 
    }

    initPagination() {
      this.refresh( new FetchServices(this.fetchUrl) );
    }

    refresh(fetchServices) {
      if (this.refreshing) return;
      if (fetchServices) {
        this.fetchServices = fetchServices;
      } else {
        this.fetchServices = this.fetchServices && this.fetchServices.clone();
      }
      if(!this.fetchServices) return;
      this.beforeRefresh();
      this.fetchServices
        .refresh()
        .then((res) => {
          this.onRefresh(res);
        })
        .catch((error) => {
          this.onRefreshError(error);
        });
    };

    beforeRefresh() {
      this.refreshing = true ;  
      this.callbacks.beforeRefresh && this.callbacks.beforeRefresh();
      this.event.emit("onBeforeRefresh"); 
    }

    onRefresh(res) {
      this.refreshing = false ; 
      this.callbacks.onRefresh && this.callbacks.onRefresh( res );
      this.event.emit("onRefresh" , res ); 
    }

    onRefreshError(error) {
      this.refreshing = false ; 
      this.callbacks.onRefreshError && this.callbacks.onRefreshError(error);
      this.event.emit("onRefreshError" , error );
    }

    /**
     * getNext monitors for 4 different checkpoints
     * 1. It wont call next page if allready fetching data of previous page
     * 2. Wont next page when pull to refresh is done
     * 3. Will stop pagination if next page payload is not present
     */
    getNext(){
      if (
        this.loadingNext ||
        this.refreshing ||
        !this.fetchServices.hasNextPage 
      )
        return;
      this.beforeNext();
      this.fetchServices
        .fetch()
        .then((res) => {
          this.onNext(res);
        })
        .catch((error) => {
          this.onNextError(error);
        });
    };

    beforeNext() {
      this.loadingNext =  true ;  
      this.callbacks.beforeNext && this.callbacks.beforeNext();
      this.event.emit("onBeforeNext");
    }

    onNext(res) {
        this.loadingNext =  false ; 
        this.callbacks.onNext && this.callbacks.onNext( res );
        this.event.emit("onNext" , res);
    }

    onNextError(error) {
      this.loadingNext =  false ;  
      this.callbacks.onNextError && this.callbacks.onNextError(error);
      this.event.emit("onNextError");
    }

    getList(){
      return this.fetchServices.getIDList() || [];
    }

    getResults(){
      return this.fetchServices.getAllResults() || [];
    }

    getMeta(){
      return this.fetchServices.getMeta();
    }

    deleteItem( id , path="id" ){
        if(!id) return;
        this.fetchServices.results =  this.getResults().filter((item)=> {return deepGet( item , path ) !=  id });
        console.log("this.fetchServices.results" ,this.fetchServices.results );
    }

    addItems( items ) {
      this.getResults().unshift( items );
    }

  };


export default Pagination ;