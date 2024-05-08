<script>
    import {appStatus, setAppStatusLoading, setAppStatusError, setAppStatusChatMode} from "../store.ts"
    import Dropzone from "svelte-file-dropzone";
  
    let files = {
      accepted: [],
      rejected: []
    };
  
    async function handleFilesSelect(e) {
      const { acceptedFiles, fileRejections } = e.detail;
      files.accepted = [...files.accepted, ...acceptedFiles];
      files.rejected = [...files.rejected, ...fileRejections];
    
    if(acceptedFiles.length > 0){
        setAppStatusLoading()
        const formData = new FormData()
        formData.append('file', acceptedFiles[0])
        
      try{
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        
       if(!res.ok){
        setAppStatusError()
        return
       }

       const {id, url, pages} = await res.json()

      
       setAppStatusChatMode({id,url,pages})

    }catch(error){
      console.error("Un error ocurrio durante la subida del archivo.", error);
      setAppStatusError();
    }

    }}

  </script>

{#if files.accepted.length === 0}
  



<div class="border-purple-500 border-2"><Dropzone accept="application/pdf"  multiple={false}
    on:drop={handleFilesSelect}> 
    
    <p class="text-black"> Arrastra aqui su PDF</p> 
    
</Dropzone>   
</div>
  







{/if}

    <ol>
    {#each files.accepted as item}
      <li>{item.name}</li>
    {/each}
  </ol>

  