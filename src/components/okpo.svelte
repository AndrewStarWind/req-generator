<script>
   import { generate } from '../utils/generateOkpo';
   import Button, { Label } from '@smui/button/styled';
   import Textfield from '@smui/textfield';
   import Checkbox from '@smui/checkbox';
   import FormField from '@smui/form-field';


   let isIE = false;
   let value = '';


   const generateOkpo = () => {
      value = generate(isIE);
   }
</script>

<div class="form">
   <div class="form-group">
      <Textfield type="text" bind:value="{value}" label="ОКПО:"/>
      <FormField>
         <Checkbox bind:checked={isIE} />
         <span slot="label">ИП</span>
      </FormField>
      <Button on:click={generateOkpo}>
         <Label>Сгенерировать</Label>
      </Button>
   </div>
</div>
