#### started July 2020 - create dataset from bateson for colonialBackdrop visualisation ####

## load libraries
library(readxl)
library(gsheet)
library(dplyr)
library(tidyr)
library(ggplot2)
library(RColorBrewer)
library(ggthemes)
library(gridExtra)
library(stringr)

## load data
# Bateson voyages
bateson <- read_xls("/Users/mschwarz/Desktop/Convicts/Voyage/Bateson\ Convict\ Voyages\ List.xls", sheet = 1)
bateson <- bateson %>%
  select(Ship, `Year Arrived`, `Colony bound for`, `Male Convicts`, `Female Convicts`, Departed)

# Ships before 1800
batesonBefore <- read_xlsx("/Users/mschwarz/Desktop/Convicts/Voyage/BatesonShipsBefore1800.xlsx", sheet = 1)

# Merge data
bateson <- rbind(bateson, batesonBefore)


# How many male and female convicts on board?
maleBateson <- bateson %>%
  select(`Year Arrived`, `Colony bound for`, `Male Convicts`, `Ship`) 
colnames(maleBateson) <- c('year', 'port', 'count', 'ship')
maleBateson$gender <- 'male'
femaleBateson <- bateson %>%
  select(`Year Arrived`, `Colony bound for`, `Female Convicts`, `Ship`) 
colnames(femaleBateson) <- c('year', 'port', 'count', 'ship')
femaleBateson$gender <- 'female'
genderBateson <- rbind(femaleBateson, maleBateson)
rm(maleBateson, femaleBateson)
genderBateson <- genderBateson[!is.na(genderBateson$count) & !is.na(genderBateson$port),]

# number of people arriving in Australia per year divided by gender
convictsPerYear <- genderBateson %>%
  group_by(year, port) %>%
  summarise(convictCount = sum(count))

## Gender
wideGender <- genderBateson %>%
  select(year, count, gender) %>%
  group_by(year, gender) %>%
  summarise(numbers = sum(count)) %>%
  spread(gender, numbers)
wideGender[is.na(wideGender)] <- 0
wideGender$year <- as.character(wideGender$year)
colnames(wideGender) <- c("Year", "Female", "Male")


## Arrival Port
wideArrival <- convictsPerYear %>%
  spread(port, convictCount)
wideArrival[is.na(wideArrival)] <- 0
wideArrival$year <- as.character(wideArrival$year)
colnames(wideArrival) <- c("Year", "MOR", "NOR", "NSW", "PP", "VDL", "WA")

# scale down to necessary columns and rename
data <- bateson %>%
  filter(!is.na(`Year Arrived`) & !is.na(Departed)) %>%
  select(`Year Arrived`, `Colony bound for`, `Male Convicts`, `Female Convicts`, Departed)
colnames(data) <- c('Year', 'Colony', 'Male', 'Female', 'Departed')

# some checks
unique(data$Colony) # one row with NA's, removed with filter above
unique(data$Departed) # removed 12 rows without a departure port with filter above

## Origin: assign depending on departure port
data$Origin <- ''
data[data$Departed == 'England',]$Origin <- 'England'
data[data$Departed == 'Spithead',]$Origin <- 'England'
data[data$Departed == 'Cowes',]$Origin <- 'England'
data[data$Departed == 'Falmouth',]$Origin <- 'England'
data[data$Departed == 'P’smouth',]$Origin <- 'England'
data[data$Departed == 'London',]$Origin <- 'England'
data[data$Departed == 'Downs',]$Origin <- 'England'
data[data$Departed == 'Plymouth',]$Origin <- 'England'
data[data$Departed == 'Deal',]$Origin <- 'England'
data[data$Departed == 'Woolwich',]$Origin <- 'England'
data[data$Departed == 'Sheerness',]$Origin <- 'England'
data[data$Departed == 'Gravesend',]$Origin <- 'England'
data[data$Departed == 'Devonport',]$Origin <- 'England'
data[data$Departed == 'P’Smouth',]$Origin <- 'England'
data[data$Departed == 'Torbay',]$Origin <- 'England'
data[data$Departed == 'Portland',]$Origin <- 'England'
data[data$Departed == 'Scilly Is.',]$Origin <- 'England'
data[data$Departed == 'Deptford',]$Origin <- 'England'
data[data$Departed == 'Portsmouth',]$Origin <- 'England'
data[data$Departed == 'Yarmouth Rds',]$Origin <- 'England'
data[data$Departed == 'Portland Rds',]$Origin <- 'England'

data[data$Departed == 'Ireland',]$Origin <- 'Ireland'
data[data$Departed == 'Cork',]$Origin <- 'Ireland'
data[data$Departed == 'Waterford',]$Origin <- 'Ireland'
data[data$Departed == 'Dublin',]$Origin <- 'Ireland'

data[data$Departed == 'Cape',]$Origin <- 'Overseas'
data[data$Departed == 'Gibraltar',]$Origin <- 'Overseas'
data[data$Departed == 'Q’stown',]$Origin <- 'Overseas'
data[data$Departed == 'K’stown',]$Origin <- 'Overseas'

data$Convicts <- 0
data[is.na(data)] <- 0
data['Convicts'] <- data$Male + data$Female

origin <- data %>%
  select(Year, Origin, Convicts) %>%
  group_by(Year, Origin) %>%
  summarise(total = sum(Convicts)) %>%
  spread(Origin, total)

origin[is.na(origin)] <- 0
origin$Year <- as.character(origin$Year)


### Political Convicts
# Rude data
rude <- read_xlsx('/Users/mschwarz/Desktop/Convicts/Voyage/RebelsOnShips2020_05_22.xlsx', range = cell_rows(1:146), sheet = 1)
rude$Protesters[is.na(rude$Protesters)] <- 0
#create a dataset for the political protesters
polis <- rude %>%
  select(`Arrival Year`, Protesters) %>%
  group_by(`Arrival Year`, ) %>%
  summarise(Politicals = sum(Protesters))
years <- wideGender[1]
politics <- merge(years, polis, by.x = "Year", by.y = "Arrival Year", all.x = TRUE)
politics[is.na(politics)] <- 0
remove(years,polis)
colnames(politics) <- c("Year", "Protesters")

# add the non-political protesters as a separate row
wideGender$All <- wideGender$Female + wideGender$Male
politics$Nonprotesters <- wideGender$All - politics$Protesters


# Glue everything together
wideData <- cbind(wideArrival, wideGender[2:3], origin[2:4], politics[2:3])


# Two years are missing
wideData <- ungroup(wideData)
wideData <- wideData %>%
  add_row(Year = c('1789', '1860'))
wideData[is.na(wideData)] <- 0
wideData$Year <- as.numeric(wideData$Year)
wideData <- arrange(wideData, Year)
wideData$Year <- as.character(wideData$Year)

write.csv(wideData, file = "/Users/mschwarz/colonialBackdrop/data/wideData.csv")


