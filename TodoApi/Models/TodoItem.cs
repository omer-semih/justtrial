namespace TodoApi.Models
{
    public class TodoItem
    {
        public int Id { get; set; }           // task id
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } // task tamamlandı mı?
    }
}