<script>
</script>

<template>
        <div class="text-center"><h1 class="display-7">Currency Exchange</h1></div>
        
        <div class="text-center">
        <div class="btn-group">
        <select class="form-select form-select-lg mb-3" style="width:300px">
        <option selected>Select Starting Currency</option>
            <option value="1">USD</option>
            <option value="2">EUR</option>
            <option value="3">CAD</option>
        </select>
        &ensp;&ensp;
        <select class="form-select form-select-lg mb-3" style="width:300px">
        <option selected>Select Ending Currency</option>
            <option value="1">USD</option>
            <option value="2">EUR</option>
            <option value="3">CAD</option>
        </select>
        </div>
        </div>
        <div class="text-center">
        <div class="btn-group">
        <div class="input-group mb-3">
        <span class="input-group-text">$</span>
        <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
        <span class="input-group-text">.00</span>
        </div>
        &ensp;&ensp;
        <div class="input-group mb-3">
        <span class="input-group-text">$</span>
        <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)" disabled readonly>
        <span class="input-group-text">.00</span>
        </div>
        </div>
        </div>


        
        <div class="text-center">
            <button type="button" class="btn btn-primary"
                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: 7.5rem; --bs-btn-font-size: 2rem;">
                    Convert
        </button>


        </div>

</template>

<style>

</style>