<script>
export default {
  name: 'CreateEntry',
  data() {
    return {
          DowntimeCode = "",
          DownTimeL1 = "",
          DownTimeL2 = "",
          DownTimeL3 = "",
          DownTimeL4 = "",
          AccessLevel = "",
          Filter = "",
          Valid = "",
          Rank = "",
          Exclude = "",
          Description = ""
    }
  },
  methods: {
      createEntry() {
          const payload = {
                DowntimeCode: this.DowntimeCode,
                DownTimeL1: this.DownTimeL1,
                DownTimeL2: this.DownTimeL2,
                DownTimeL3: this.DownTimeL3,
                DownTimeL4: this.DownTimeL4,
                AccessLevel: this.AccessLevel,
                Filter: this.Filter,
                Valid: this.Valid,
                Rank: this.Rank,
                Exclude: this.Exclude,
                Description: this.Description
          }
          this.$emit('createEntry', payload)
          this.clearForm();
      },
      clearForm() {
          this.DowntimeCode = "",
          this.DownTimeL1 = "",
          this.DownTimeL2 = "",
          this.DownTimeL3 = "",
          this.DownTimeL4 = "",
          this.AccessLevel = "",
          this.Filter = "",
          this.Valid = "",
          this.Rank = "",
          this.Exclude = "",
          this.Description = ""
          }
      }
  }
</script>