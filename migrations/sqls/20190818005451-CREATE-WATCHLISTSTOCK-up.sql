CREATE TABLE  WatchlistStock (
  WatchlistStock INT AUTO_INCREMENT PRIMARY KEY,
  StockId INT NOT NULL,
  WatchDate DATE NOT NULL,
  WatchPrice DECIMAL(6,2) NOT NULL,
  CONSTRAINT FK_WatchlistStock_Stock_StockId FOREIGN KEY (StockId) REFERENCES Stock(StockId) ON DELETE CASCADE
);