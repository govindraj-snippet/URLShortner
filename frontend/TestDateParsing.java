import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TestDateParsing {
    public static void main(String[] args) {
        String dateStr = "2023-10-27T10:00:00.000Z";
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime date = LocalDateTime.parse(dateStr, formatter);
            System.out.println("Parsed: " + date);
        } catch (Exception e) {
            System.out.println("Failed: " + e.getMessage());
        }
    }
}
